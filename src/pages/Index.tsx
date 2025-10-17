import { useState, useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import SQLResult from "@/components/SQLResult";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [showResult, setShowResult] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [csvFiles, setCsvFiles] = useState<any[]>([]);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    loadCsvFiles();
  }, [user, authLoading, navigate]);

  const loadCsvFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('csv_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCsvFiles(data || []);
    } catch (error: any) {
      console.error('Error loading CSV files:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (csvFiles.length === 0) {
      toast.error("Please upload a CSV file first");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('query-csv', {
        body: { 
          query: message,
          fileId: csvFiles[0].id
        }
      });

      if (error) throw error;

      setQueryResult({
        query: data.query,
        data: data.data.slice(0, 5),
        explanation: `Found ${data.data.length} results from ${csvFiles[0].file_name}`
      });
      setShowResult(true);
    } catch (error: any) {
      console.error('Query error:', error);
      toast.error(error.message || "Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }


  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              🤖 Chat with Your Data 😃
            </h1>
            <p className="text-muted-foreground">Ask questions, get instant insights</p>
          </div>

          {csvFiles.length === 0 && (
            <div className="text-center p-8 bg-[hsl(var(--muted))]/50 rounded-lg">
              <p className="text-[hsl(var(--muted-foreground))]">
                Upload a CSV file to start querying your data
              </p>
            </div>
          )}
          
          {showResult && queryResult && (
            <SQLResult 
              query={queryResult.query}
              data={queryResult.data}
              explanation={queryResult.explanation}
            />
          )}
        </div>
      </div>

      <div className="border-t p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
