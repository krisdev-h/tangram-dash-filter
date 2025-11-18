import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Submission } from "@/types/submission";
import tangramLogo from "@/assets/tangram_logo.jpeg";

interface MessagesProps {
  submissions: Submission[];
  sentMessages: Array<{ id: string; submissionId: string; message: string; timestamp: Date }>;
  onSendMessage: (submissionId: string, message: string) => void;
}

export const Messages = ({ submissions, sentMessages, onSendMessage }: MessagesProps) => {
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [message, setMessage] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  const handleSend = () => {
    if (!selectedCase || !message.trim()) return;

    onSendMessage(selectedCase, message);
    setMessage("");
    setSelectedCase("");
  };

  const handleChatBotSend = () => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [...prev, { text: message, sender: "user" }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: "Your client has been contacted.", sender: "bot" }]);
    }, 500);
    setMessage("");
  };

  const submittedSubmissions = submissions.filter(s => s.stage === "submitted");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Send Column */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Send</h2>
        <div className="bg-card border border-border rounded-lg p-4 min-h-[600px]">
          <div className="space-y-4">
            <div className="flex items-start gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <img src={tangramLogo} alt="Tangram" className="w-6 h-6 rounded-full object-cover" />
              </div>
              <div className="bg-secondary rounded-lg p-3 flex-1">
                <p className="text-sm">What would you like to communicate to your client?</p>
              </div>
            </div>

            {showChatBot && chatMessages.map((msg, idx) => (
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

            <Select value={selectedCase} onValueChange={(value) => { setSelectedCase(value); setShowChatBot(true); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent>
                {submittedSubmissions.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name} - {sub.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showChatBot && (
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatBotSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleChatBotSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sent Column */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sent</h2>
        <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
          {sentMessages.map(msg => {
            const submission = submissions.find(s => s.id === msg.submissionId);
            return (
              <div key={msg.id} className="bg-secondary border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{submission?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{submission?.company}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Received Column */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Received</h2>
        <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Triangle</span>
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">TechCorp Industries</p>
            <p className="text-sm">Thank you for the detailed report! We'd like to proceed with the traditional tooling method. When can we schedule a call to discuss the next steps?</p>
          </div>
        </div>
      </div>
    </div>
  );
};
