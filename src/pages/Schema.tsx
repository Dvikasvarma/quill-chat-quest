import { Search, Table } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Schema = () => {
  const sampleTables = [
    {
      name: "sales_data",
      columns: ["id", "product_name", "profit", "date", "category"],
    },
    {
      name: "customers",
      columns: ["id", "name", "email", "created_at"],
    },
    {
      name: "products",
      columns: ["id", "name", "price", "stock", "category"],
    },
  ];

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

        <div className="grid gap-4">
          {sampleTables.map((table) => (
            <Card key={table.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  {table.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {table.columns.map((column) => (
                    <span
                      key={column}
                      className="px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-sm"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schema;
