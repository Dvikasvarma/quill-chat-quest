import { Upload, Database, Search, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Sidebar = () => {
  return (
    <div className="w-72 bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold">QueryQuill</h1>
      </div>

      <div className="flex-1 px-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 bg-[hsl(var(--sidebar-accent))] hover:bg-[hsl(var(--sidebar-accent))]/80 text-white"
        >
          <Upload className="w-5 h-5" />
          Upload CSV
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 hover:bg-white/10"
        >
          <Upload className="w-5 h-5" />
          Upload CSV
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 hover:bg-white/10"
        >
          <Database className="w-5 h-5" />
          Connect to BigQuery
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 hover:bg-white/10"
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
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
