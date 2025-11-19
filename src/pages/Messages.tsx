import { useState } from "react";
import { Send, Check, X as XIcon } from "lucide-react";
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
  const [assistantSuggestion, setAssistantSuggestion] = useState<{
    submissionId: string;
    clientLabel: string;
    text: string;
  } | null>(null);

  // Respond dialog state (for Follow up / Respond)
  const [respondOpen, setRespondOpen] = useState(false);
  const [respondClientName, setRespondClientName] = useState<string>("");
  const [respondOriginalMessage, setRespondOriginalMessage] =
    useState<string>("");
  const [respondSubmissionId, setRespondSubmissionId] = useState<string | null>(
    null
  );

  // Helper: find which submission/client the prompt is about
  const findTargetSubmission = (prompt: string): Submission | undefined => {
    const lower = prompt.toLowerCase();

    // Try full company-name match first
    for (const sub of submissions) {
      const company = (sub.company || "").toLowerCase();
      if (company && lower.includes(company)) return sub;
    }

    // Then try matching just the first word of company name
    for (const sub of submissions) {
      const company = (sub.company || "").toLowerCase();
      if (!company) continue;
      const firstWord = company.split(" ")[0];
      if (firstWord && lower.includes(firstWord)) return sub;
    }

    // Fallback: currently-selected case
    if (selectedCase) {
      return submissions.find((s) => s.id === selectedCase) || submissions[0];
    }

    // Final fallback: first submission
    return submissions[0];
  };

  // Helper: generate a "professional" message from a natural-language prompt
  const buildSuggestedMessage = (prompt: string, company: string): string => {
    const lowerPrompt = prompt.toLowerCase().trim();

    // Special case: explicit "report" follow-up
    if (lowerPrompt.includes("report")) {
      return `Hi ${company} team,

I hope you’re doing well. I wanted to follow up on the report we recently shared and see how it landed on your side. Please let us know if everything met your expectations or if there are any questions, clarifications, or changes you’d like us to make.

Best regards,
Tangram Team`;
    }

    // Try to strip scaffolding like:
    // "write a message to Innovation Labs saying 3d printing is best based on geometry in a professional tone"
    let core = prompt;

    // Remove "write/draft ... message/email to <client>" prefix if present
    const scaffoldRegex = /(write|draft)\s+(an\s+)?(email|message)\s+to\s+[^,]+/i;
    if (scaffoldRegex.test(core)) {
      core = core.replace(scaffoldRegex, "");
    }

    // If there's "saying" or "that", keep what's after it
    const lowerCore = core.toLowerCase();
    const sayingIdx = lowerCore.indexOf("saying");
    const thatIdx = lowerCore.indexOf("that");
    let cutIdx = -1;
    if (sayingIdx !== -1) {
      cutIdx = sayingIdx + "saying".length;
    } else if (thatIdx !== -1) {
      cutIdx = thatIdx + "that".length;
    }
    if (cutIdx !== -1) {
      core = core.slice(cutIdx);
    }

    // Clean up leading punctuation/whitespace
    core = core.replace(/^[:\s,]*/g, "");

    // Strip "in a professional tone/manner" / "professionally" at the end
    core = core
      .replace(/in a professional( tone| manner)?\.?$/i, "")
      .replace(/professionally\.?$/i, "")
      .trim();

    // If nothing meaningful left, fall back to a generic follow-up
    if (!core) {
      return `Hi ${company} team,

I hope you’re doing well. I wanted to quickly follow up regarding your project and see if there is anything we can clarify or help with.

Best regards,
Tangram Team`;
    }

    const coreLower = core.toLowerCase();

    // Slightly smarter template if we're talking about 3D printing
    if (coreLower.includes("3d printing")) {
      return `Hi ${company} team,

Based on your part geometry, we believe 3D printing is the best manufacturing option for this project. It should give you the right balance between lead time, flexibility for design changes, and overall cost at your expected volumes.

Best regards,
Tangram Team`;
    }

    // Generic professional wrapper around the cleaned core instruction
    let sentence = core.trim();
    sentence =
      sentence.charAt(0).toUpperCase() + sentence.slice(1);
    if (!/[.!?]$/.test(sentence)) {
      sentence += ".";
    }

    return `Hi ${company} team,

${sentence}

Best regards,
Tangram Team`;
  };

  // Derived "received" messages (reference from each submission)
  const receivedMessages = submissions.map((submission) => {
    const s = submission as any;

    const clientLabel =
      s?.clientName ??
      s?.company ??
      s?.projectName ??
      `Case ${submission.id}`;

    let referenceMessage = "";

    if (submission.company === "TechCorp Industries") {
      referenceMessage =
        "Hi team, we’re evaluating suppliers for this triangular enclosure. Can you confirm whether the 0.8–1.2 mm wall thickness is acceptable for tooling? Also, could you advise if a textured finish is possible on the outer face?";
    } else if (submission.company === "BuildRight Solutions") {
      referenceMessage =
        "Hello, attached are the specs for the square housing. We mainly need cost estimates at 1,000 units and 5,000 units. Please confirm if aluminum tooling is required or if composite molds would work.";
    } else if (submission.company === "Innovation Labs") {
      referenceMessage =
        "Hi, we’re looking to prototype this circular casing before moving to full production. Could you provide recommendations on whether we should start with 3D printing or soft tooling based on our geometry?";
    } else {
      referenceMessage =
        s?.referenceMessage ??
        s?.clientMessage ??
        s?.notes ??
        "Client message not provided.";
    }

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

  // Tangram Assistant: generate suggestion
  const handleAssistantGenerate = () => {
    if (!chatbotInput.trim() || submissions.length === 0) return;

    const target = findTargetSubmission(chatbotInput);
    if (!target) return;

    const clientLabel = target.company || "Client";
    const text = buildSuggestedMessage(chatbotInput, clientLabel);

    setAssistantSuggestion({
      submissionId: target.id,
      clientLabel,
      text,
    });
  };

  // Accept suggested AI message -> goes straight to Sent
  const handleAssistantAccept = () => {
    if (!assistantSuggestion) return;

    onSendMessage(assistantSuggestion.submissionId, assistantSuggestion.text);
    setSelectedCase(assistantSuggestion.submissionId);
    setMessage(""); // already sent the AI draft
    setAssistantSuggestion(null);
    setChatbotInput("");
  };

  const handleAssistantReject = () => {
    setAssistantSuggestion(null);
  };

  // When we hit "Send Response" in the RespondDialog,
  // push the response into Sent for that client/case.
  const handleSendResponse = (response: string) => {
    if (!response.trim() || !respondSubmissionId) {
      setRespondOpen(false);
      return;
    }

    onSendMessage(respondSubmissionId, response.trim());
    setRespondOpen(false);
    setRespondSubmissionId(null);
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
    setRespondSubmissionId(submissionId);
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
                  Ask in plain language – we’ll draft a professional message you
                  can send.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={chatbotInput}
                onChange={(e) => setChatbotInput(e.target.value)}
                placeholder="e.g. write a message to TechCorp asking how their report was…"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAssistantGenerate()
                }
              />
              <Button
                onClick={handleAssistantGenerate}
                size="icon"
                disabled={!chatbotInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {assistantSuggestion && (
              <div className="mt-3 border rounded-md p-3 bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Suggested message to {assistantSuggestion.clientLabel}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAssistantReject}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={handleAssistantAccept}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-line">
                  {assistantSuggestion.text}
                </p>
              </div>
            )}
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
