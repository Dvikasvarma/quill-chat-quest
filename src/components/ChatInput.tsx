import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask were the top 5 products by profit?"
        className="flex-1 h-12 text-base"
        disabled={disabled}
      />
      <Button 
        onClick={handleSend}
        className="h-12 px-8 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90"
        disabled={disabled}
      >
        Ask
      </Button>
    </div>
  );
};

export default ChatInput;
