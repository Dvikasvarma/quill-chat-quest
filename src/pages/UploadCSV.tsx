import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";

const UploadCSV = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        toast.success(`CSV file "${file.name}" uploaded successfully!`);
      } else {
        toast.error("Please upload a valid CSV file");
      }
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
        >
          <Upload className="w-5 h-5 mr-2" />
          Choose CSV File
        </Button>
      </div>
    </div>
  );
};

export default UploadCSV;
