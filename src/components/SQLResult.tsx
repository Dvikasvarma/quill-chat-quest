import { Database, TrendingUp, MessageSquare } from "lucide-react";

interface SQLResultProps {
  query: string;
  data: Array<Record<string, string | number>>;
  explanation: string;
}

const SQLResult = ({ query, data, explanation }: SQLResultProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Generated SQL */}
      <div className="rounded-lg border bg-[hsl(var(--success-bg))] border-[hsl(var(--success-text))]/20 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--success-text))]/20">
          <Database className="w-5 h-5 text-[hsl(var(--success-text))]" />
          <span className="font-semibold text-[hsl(var(--success-text))]">Generated SQL</span>
        </div>
        <div className="p-4 bg-[hsl(var(--code-bg))] text-sm">
          <pre className="text-gray-300 font-mono">
            <code>{query}</code>
          </pre>
        </div>
      </div>

      {/* Result Table */}
      <div className="rounded-lg border bg-[hsl(var(--success-bg))] border-[hsl(var(--success-text))]/20 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--success-text))]/20">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--success-text))]" />
          <span className="font-semibold text-[hsl(var(--success-text))]">Result</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                {data.length > 0 && Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  {Object.values(row).map((value, j) => (
                    <td key={j} className="px-6 py-3 text-sm text-foreground">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="rounded-lg border bg-[hsl(var(--warning-bg))] border-[hsl(var(--warning-text))]/20 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--warning-text))]/20">
          <MessageSquare className="w-5 h-5 text-[hsl(var(--warning-text))]" />
          <span className="font-semibold text-[hsl(var(--warning-text))]">AI Explanation</span>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
          <button className="mt-4 text-[hsl(var(--primary))] font-medium text-sm hover:underline">
            Visualize Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SQLResult;
