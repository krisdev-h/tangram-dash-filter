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
import { Textarea } from "@/components/ui/textarea";
import tangramLogo from "@/assets/tangram_cube.jpg";

interface RespondDialogProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  originalMessage: string;
  onSendResponse: (response: string) => void;
}

export const RespondDialog = ({ open, onClose, clientName, originalMessage, onSendResponse }: RespondDialogProps) => {
  const [response, setResponse] = useState("");

  const handleSend = () => {
    if (!response.trim()) return;
    onSendResponse(response);
    setResponse("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Respond to {clientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Original message:</p>
            <p className="text-sm">{originalMessage}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your response:</label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleSend} disabled={!response.trim()} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Response
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
