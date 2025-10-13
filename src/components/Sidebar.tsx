import { Upload, Database, Search, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Sidebar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBigQueryMode, setIsBigQueryMode] = useState(false);

  const handleUploadCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        toast.success(`CSV file "${file.name}" uploaded successfully!`);
        // Here you would typically process the CSV file
      } else {
        toast.error("Please upload a valid CSV file");
      }
    }
  };

  const handleConnectBigQuery = () => {
    toast.info("BigQuery connection dialog would open here");
    // Here you would typically open a modal for BigQuery credentials
  };

  const handleViewSchema = () => {
    toast.info("Schema viewer would open here");
    // Here you would typically show the current database schema
  };

  const handleBigQueryToggle = (checked: boolean) => {
    setIsBigQueryMode(checked);
    toast.success(checked ? "BigQuery mode enabled" : "BigQuery mode disabled");
  };

  return (
    <div className="w-72 bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold">QueryQuill</h1>
      </div>

      <div className="flex-1 px-4 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 bg-[hsl(var(--sidebar-accent))] hover:bg-[hsl(var(--sidebar-accent))]/80 text-white"
          onClick={handleUploadCSV}
        >
          <Upload className="w-5 h-5" />
          Upload CSV
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 hover:bg-white/10"
          onClick={handleConnectBigQuery}
        >
          <Database className="w-5 h-5" />
          Connect to BigQuery
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 hover:bg-white/10"
          onClick={handleViewSchema}
        >
          <Search className="w-5 h-5" />
          View Schema
        </Button>
      </div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Cloud className="w-4 h-4" />
            <span>BigQuery Mode</span>
          </div>
          <Switch checked={isBigQueryMode} onCheckedChange={handleBigQueryToggle} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
