import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import tangramLogo from "@/assets/tangram_logo.jpeg";

interface ClientChatDialogProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  onSendMessage: (message: string) => void;
}

export const ClientChatDialog = ({ open, onClose, clientName, onSendMessage }: ClientChatDialogProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    onSendMessage(message);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Your client has been contacted.", sender: "bot" }]);
    }, 500);

    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact {clientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <img src={tangramLogo} alt="Tangram" className="w-6 h-6 rounded-full object-cover" />
              </div>
              <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">What would you like to communicate to your client?</p>
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "items-start gap-2"}`}>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <img src={tangramLogo} alt="Tangram" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
