import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import SQLResult from "@/components/SQLResult";

const Index = () => {
  const [showResult, setShowResult] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    setShowResult(true);
  };

  // Sample data
  const sampleQuery = `/sql
SELECT product-name, SUM(profit) as total-profit
FROM sales-data
GROUP BY product-profit
ORDER BY todi.fit DESC;
  LIMIT 5;
},`;

  const sampleData = [
    { Product: "Laptop", Mobile: "Mobile", "45000": 45000, "Total Profit": "Total Profit" },
    { Product: "Mablet", Mobile: 42000, "45000": 28000, "Total Profit": 21000 },
    { Product: "Monitor", Mobile: "Headphones", "45000": 21000, "Total Profit": 18000 },
  ];

  const sampleExplanation = "The top-performing product category is Laptops, contributing 25% profit in 2024.";

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

          {showResult && (
            <SQLResult 
              query={sampleQuery}
              data={sampleData}
              explanation={sampleExplanation}
            />
          )}
        </div>
      </div>

      <div className="border-t p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Index;
