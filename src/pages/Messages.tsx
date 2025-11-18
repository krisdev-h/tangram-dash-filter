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
import tangramLogo from "@/assets/tangram_cube.jpg";
import { RespondDialog } from "@/components/RespondDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MessagesProps {
  submissions: Submission[];
  sentMessages: Array<{
    id: string;
    submissionId: string;
    message: string;
    timestamp: Date | string;
  }>;
  onSendMessage: (submissionId: string, message: string) => void;
}

export const Messages = ({
  submissions,
  sentMessages,
  onSendMessage,
}: MessagesProps) => {
  // Main Send column state
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Tangram Assistant state
  const [chatbotInput, setChatbotInput] = useState<string>("");
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);
  const [assistantSelectedCase, setAssistantSelectedCase] = useState("");

  // Respond dialog state (for Follow up / Respond)
  const [respondOpen, setRespondOpen] = useState(false);
  const [respondClientName, setRespondClientName] = useState<string>("");
  const [respondOriginalMessage, setRespondOriginalMessage] =
    useState<string>("");

  // Derived "received" messages (reference from each submission)
  const receivedMessages = submissions.map((submission) => {
    const s = submission as any;
    const clientLabel =
      s?.clientName ??
      s?.company ??
      s?.projectName ??
      `Case ${submission.id}`;

    const referenceMessage =
      s?.referenceMessage ??
      s?.clientMessage ??
      s?.notes ??
      "Reference message from client about this case.";

    return {
      id: submission.id,
      submissionId: submission.id,
      clientLabel,
      message: referenceMessage,
    };
  });

  // Send column: actually send to selected case
  const handleSend = () => {
    if (!selectedCase || !message.trim()) return;
    onSendMessage(selectedCase, message.trim());
    setMessage("");
  };

  // AI Assistant: click arrow in Tangram Assistant card
  const handleAssistantSendClick = () => {
    if (!chatbotInput.trim()) return;
    // Open AI assistant dialog to pick which client this should go to
    setAssistantDialogOpen(true);
  };

  // When user clicks "Open Case" in the AI Assistant dialog:
  //  - send chatbotInput as message
  //  - show it in Sent column
  //  - pre-select the client in the Send panel
  const handleAssistantOpenCase = () => {
    if (!assistantSelectedCase || !chatbotInput.trim()) return;

    onSendMessage(assistantSelectedCase, chatbotInput.trim());

    // Pre-select client + message in Send UI
    setSelectedCase(assistantSelectedCase);
    setMessage(chatbotInput.trim());

    setChatbotInput("");
    setAssistantDialogOpen(false);
  };

  const handleSendResponse = (response: string) => {
    console.log("Sending response:", response);
    setRespondOpen(false);
    // If later you want follow-ups to be tracked, call onSendMessage here.
  };

  const openRespondDialog = (submissionId: string, message: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    const s = submission as any;
    const clientLabel =
      s?.clientName ??
      s?.company ??
      s?.projectName ??
      `Case ${submissionId}`;

    setRespondClientName(clientLabel);
    setRespondOriginalMessage(message);
    setRespondOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Send Column */}
        <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Send</h2>

          {/* Case / Client selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select client / case
            </label>
            <Select
              value={selectedCase}
              onValueChange={(value) => setSelectedCase(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a case…" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((submission) => {
                  const s = submission as any;
                  const label =
                    s?.clientName ??
                    s?.company ??
                    s?.projectName ??
                    `Case ${submission.id}`;
                  return (
                    <SelectItem key={submission.id} value={submission.id}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Message input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Message
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message to client…"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={!selectedCase || !message.trim()}
            >
              Send
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Tangram Assistant helper */}
          <div className="mt-6 border rounded-lg p-4 flex flex-col gap-3 bg-card">
            <div className="flex items-center gap-3">
              <img
                src={tangramLogo}
                alt="Tangram"
                className="h-8 w-8 rounded-md object-cover"
              />
            <div>
                <p className="font-medium text-sm">Tangram Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Use AI to help draft messages, then edit and send.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={chatbotInput}
                onChange={(e) => setChatbotInput(e.target.value)}
                placeholder="Ask Tangram to help write a message…"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAssistantSendClick()
                }
              />
              <Button
                onClick={handleAssistantSendClick}
                size="icon"
                disabled={!chatbotInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Received Column */}
        <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Received
          </h2>

          <div className="space-y-3">
            {receivedMessages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reference messages yet.
              </p>
            )}

            {receivedMessages.map((msg) => (
              <div
                key={msg.id}
                className="border rounded-md p-3 bg-card flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{msg.clientLabel}</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line">
                  {msg.message}
                </p>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openRespondDialog(msg.submissionId, msg.message)
                    }
                  >
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sent Column */}
        <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Sent</h2>

          <div className="space-y-3">
            {sentMessages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No messages sent yet.
              </p>
            )}

            {sentMessages.map((msg) => {
              const submission = submissions.find(
                (s) => s.id === msg.submissionId
              );
              const s = submission as any;
              const clientLabel =
                s?.clientName ??
                s?.company ??
                s?.projectName ??
                `Case ${submission?.id ?? msg.submissionId}`;

              return (
                <div
                  key={msg.id}
                  className="border rounded-md p-3 bg-card flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{clientLabel}</span>
                    {msg.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {msg.message}
                  </p>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openRespondDialog(msg.submissionId, msg.message)
                      }
                    >
                      Follow up
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Assistant dialog for "Open Case" */}
      <Dialog
        open={assistantDialogOpen}
        onOpenChange={setAssistantDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <DialogDescription>
              Which client would you like to contact?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Select
              value={assistantSelectedCase}
              onValueChange={(value) => setAssistantSelectedCase(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a case…" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((submission) => {
                  const s = submission as any;
                  const label =
                    s?.clientName ??
                    s?.company ??
                    s?.projectName ??
                    `Case ${submission.id}`;
                  return (
                    <SelectItem key={submission.id} value={submission.id}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              onClick={handleAssistantOpenCase}
              disabled={!assistantSelectedCase || !chatbotInput.trim()}
            >
              Open Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RespondDialog
        open={respondOpen}
        onClose={() => setRespondOpen(false)}
        clientName={respondClientName}
        originalMessage={respondOriginalMessage}
        onSendResponse={handleSendResponse}
      />
    </>
  );
};
