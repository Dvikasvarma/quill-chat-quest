import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UploadCSV = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('csv-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Parse CSV
      const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-csv', {
        body: { filePath }
      });

      if (parseError) throw parseError;

      // Save metadata
      const tableName = file.name.replace('.csv', '').replace(/[^a-zA-Z0-9]/g, '_');
      const { error: dbError } = await supabase
        .from('csv_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          table_name: tableName,
          columns: parseResult.columns,
          row_count: parseResult.rowCount
        });

      if (dbError) throw dbError;

      toast.success(`CSV file "${file.name}" uploaded successfully!`);
      navigate("/schema");
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto">
          <Upload className="w-10 h-10 text-[hsl(var(--primary))]" />
        </div>
        <h1 className="text-3xl font-bold">Upload CSV File</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Upload your CSV file to start querying your data
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          disabled={uploading}
        >
          <Upload className="w-5 h-5 mr-2" />
          {uploading ? "Uploading..." : "Choose CSV File"}
        </Button>
      </div>
    </div>
  );
};

export default UploadCSV;
