import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const BigQuery = () => {
  const [projectId, setProjectId] = useState("");
  const [dataset, setDataset] = useState("");
  const [credentials, setCredentials] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentialsJson = JSON.parse(credentials);
      
      const { error } = await supabase
        .from('bigquery_connections')
        .insert({
          user_id: user.id,
          project_id: projectId,
          dataset: dataset,
          credentials: credentialsJson
        });

      if (error) throw error;

      toast.success("BigQuery connection established!");
      setProjectId("");
      setDataset("");
      setCredentials("");
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || "Failed to connect to BigQuery");
    } finally {
      setLoading(false);
    }
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
            <Input
              id="project-id"
              placeholder="your-project-id"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataset">Dataset</Label>
            <Input
              id="dataset"
              placeholder="your-dataset"
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">Service Account Key (JSON)</Label>
            <textarea
              id="credentials"
              className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] resize-none"
              placeholder="Paste your service account JSON key here"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Connecting..." : "Connect to BigQuery"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BigQuery;
