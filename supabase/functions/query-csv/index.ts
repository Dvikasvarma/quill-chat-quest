import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { query, fileId } = await req.json();
    
    console.log('Query request:', { query, fileId });

    // Get CSV file info
    const { data: csvFile, error: csvError } = await supabaseClient
      .from('csv_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (csvError) throw csvError;

    // Download and parse the CSV
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('csv-files')
      .download(csvFile.file_path);

    if (downloadError) throw downloadError;

    const text = await fileData.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse all rows
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    // Simple query processing - just filter/limit for demo
    let result = rows;
    if (query.toLowerCase().includes('limit')) {
      const limitMatch = query.match(/limit\s+(\d+)/i);
      if (limitMatch) {
        result = result.slice(0, parseInt(limitMatch[1]));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        query: query
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
