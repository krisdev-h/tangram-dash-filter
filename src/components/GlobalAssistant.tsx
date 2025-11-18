import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import tangramLogo from "@/assets/tangram_logo.jpeg";
import { Submission } from "@/types/submission";

interface GlobalAssistantProps {
  onNavigate: (page: "send" | "received" | "dashboard") => void;
  submissions: Submission[];
  onSelectCase?: (submissionId: string) => void;
}

export const GlobalAssistant = ({ onNavigate, submissions, onSelectCase }: GlobalAssistantProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>("");

  const handleOptionClick = (option: "conversation" | "respond" | "edit") => {
    setSelectedOption(option);
    
    if (option === "conversation") {
      onNavigate("send");
      setOpen(false);
    } else if (option === "respond") {
      onNavigate("received");
      setOpen(false);
    }
  };

  const handleCaseSelect = () => {
    if (selectedCase && onSelectCase) {
      onSelectCase(selectedCase);
      onNavigate("dashboard");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <img src={tangramLogo} alt="Tangram" className="w-6 h-6 rounded-full object-cover" />
              </div>
              <div className="bg-secondary rounded-lg p-3 flex-1">
                <p className="text-sm mb-3">Would you like to:</p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOptionClick("conversation")}
                  >
                    Open a conversation with a client
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOptionClick("respond")}
                  >
                    Respond to a client message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOptionClick("edit")}
                  >
                    Edit a dashboard client case
                  </Button>
                </div>
              </div>
            </div>

            {selectedOption === "edit" && (
              <div className="space-y-2">
                <Select value={selectedCase} onValueChange={setSelectedCase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case..." />
                  </SelectTrigger>
                  <SelectContent>
                    {submissions.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} - {sub.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCaseSelect} disabled={!selectedCase} className="w-full">
                  Open Case
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
