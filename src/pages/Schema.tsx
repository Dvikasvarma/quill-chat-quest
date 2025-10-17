import { Search, Table } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Schema = () => {
  const [csvFiles, setCsvFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Database Schema</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              View your database tables and columns
            </p>
          </div>
        </div>

        {csvFiles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-[hsl(var(--muted-foreground))]">
                No CSV files uploaded yet. Upload a CSV file to see its schema here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {csvFiles.map((file) => (
              <Card key={file.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="w-5 h-5" />
                    {file.file_name}
                  </CardTitle>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {file.row_count} rows
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {file.columns.map((column: any) => (
                      <span
                        key={column.name}
                        className="px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-sm"
                      >
                        {column.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schema;
