import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BigQuery = () => {
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("BigQuery connection established!");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto">
            <Database className="w-10 h-10 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-3xl font-bold">Connect to BigQuery</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Enter your BigQuery credentials to connect
          </p>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-id">Project ID</Label>
            <Input id="project-id" placeholder="your-project-id" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataset">Dataset</Label>
            <Input id="dataset" placeholder="your-dataset" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">Service Account Key (JSON)</Label>
            <textarea
              id="credentials"
              className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] resize-none"
              placeholder="Paste your service account JSON key here"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Connect to BigQuery
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BigQuery;
