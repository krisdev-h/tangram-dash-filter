import { useState } from "react";
import { Filter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterPanel } from "@/components/FilterPanel";
import { SubmissionReport } from "@/components/SubmissionReport";
import { Submission, SubmissionStage, FilterState } from "@/types/submission";
import { filterSubmissions } from "@/utils/filterSubmissions";
import { TabButton } from "@/components/TabButton";
import { Messages } from "@/pages/Messages";
import { ClientChatDialog } from "@/components/ClientChatDialog";
import { GlobalAssistant } from "@/components/GlobalAssistant";

const Index = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      name: "Triangle",
      shape: "triangle",
      stage: "pending",
      width: 150,
      depth: 100,
      height: 75,
      quantity: 500,
      deadline: "December 15th, 2025",
      company: "TechCorp Industries",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.johnson@techcorp.com",
    },
    {
      id: "2",
      name: "Square",
      shape: "square",
      stage: "reviewing",
      width: 200,
      depth: 200,
      height: 50,
      quantity: 1000,
      deadline: "January 20th, 2026",
      company: "BuildRight Solutions",
      contactName: "Michael Chen",
      contactEmail: "m.chen@buildright.com",
    },
    {
      id: "3",
      name: "Circle",
      shape: "circle",
      stage: "report",
      width: 180,
      depth: 180,
      height: 90,
      quantity: 750,
      deadline: "November 30th, 2025",
      company: "Innovation Labs",
      contactName: "Emily Rodriguez",
      contactEmail: "emily.r@innovationlabs.io",
    },
  ]);

  const [reportOpen, setReportOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "messages">("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatClient, setChatClient] = useState<Submission | null>(null);
  const [sentMessages, setSentMessages] = useState<Array<{ id: string; submissionId: string; message: string; timestamp: Date }>>([]);

  const [filters, setFilters] = useState<FilterState>({
    widthOperator: "=",
    widthValue: "",
    depthOperator: "=",
    depthValue: "",
    heightOperator: "=",
    heightValue: "",
    quantityOperator: "=",
    quantityValue: "",
    deadlineOperator: "=",
    startDate: undefined,
    endDate: undefined,
    company: "",
    contactName: "",
    contactEmail: "",
    selectedStatuses: [],
  });

  const filteredSubmissions = filterSubmissions(submissions, filters);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setReportOpen(true);
  };

  const handleStageChange = (submissionId: string, newStage: SubmissionStage) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, stage: newStage } : sub
      )
    );
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission({ ...selectedSubmission, stage: newStage });
    }
  };

  const handleSendReport = () => {
    if (selectedSubmission) {
      handleStageChange(selectedSubmission.id, "submitted");
    }
  };

  const handleChatClick = (submission: Submission) => {
    setChatClient(submission);
    setChatOpen(true);
  };

  const handleSendMessage = (submissionId: string, message: string) => {
    setSentMessages(prev => [...prev, {
      id: Math.random().toString(),
      submissionId,
      message,
      timestamp: new Date()
    }]);
  };

  const handleGlobalAssistantNavigate = (page: "send" | "received" | "dashboard") => {
    if (page === "dashboard") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("messages");
    }
  };

  const handleSelectCase = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      handleSubmissionClick(submission);
    }
  };

  const renderSubmissionCard = (submission: Submission, showChatIcon: boolean = false) => (
    <div
      key={submission.id}
      className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors relative"
      onClick={() => handleSubmissionClick(submission)}
    >
      <span className="text-sm font-medium text-foreground">{submission.name}</span>
      {showChatIcon && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleChatClick(submission);
          }}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const pendingSubmissions = filteredSubmissions.filter((s) => s.stage === "pending");
  const reviewingSubmissions = filteredSubmissions.filter((s) => s.stage === "reviewing");
  const reportSubmissions = filteredSubmissions.filter((s) => s.stage === "report");
  const submittedSubmissions = filteredSubmissions.filter((s) => s.stage === "submitted");

  if (currentPage === "messages") {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                🔧 Tangram Internal Dashboard
              </h1>
              <div className="flex gap-6 mt-4">
                <TabButton active={false} onClick={() => setCurrentPage("dashboard")}>
                  Dashboard
                </TabButton>
                <TabButton active={true} onClick={() => setCurrentPage("messages")}>
                  Messages
                </TabButton>
              </div>
            </div>
          </div>
          <Messages 
            submissions={submissions} 
            sentMessages={sentMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
        <GlobalAssistant 
          onNavigate={handleGlobalAssistantNavigate}
          submissions={submissions}
          onSelectCase={handleSelectCase}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🔧 Tangram Internal Dashboard
            </h1>
            <div className="flex gap-6 mt-4">
              <TabButton active={true} onClick={() => setCurrentPage("dashboard")}>
                Dashboard
              </TabButton>
              <TabButton active={false} onClick={() => setCurrentPage("messages")}>
                Messages
              </TabButton>
            </div>
            <p className="text-lg text-muted-foreground mt-4">{submissions.length} submissions</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-20"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-6" align="end">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Four Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Pending Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              {pendingSubmissions.map(sub => renderSubmissionCard(sub, false))}
            </div>
          </div>

          {/* Reviewing Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Reviewing
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              {reviewingSubmissions.map(sub => renderSubmissionCard(sub, false))}
            </div>
          </div>

          {/* Report Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Report
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              {reportSubmissions.map(sub => renderSubmissionCard(sub, false))}
            </div>
          </div>

          {/* Submitted Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Submitted
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              {submittedSubmissions.map(sub => renderSubmissionCard(sub, true))}
            </div>
          </div>
        </div>

      </div>

      <GlobalAssistant 
        onNavigate={handleGlobalAssistantNavigate}
        submissions={submissions}
        onSelectCase={handleSelectCase}
      />

      <ClientChatDialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        clientName={chatClient?.contactName || ""}
        onSendMessage={(message) => {
          if (chatClient) {
            handleSendMessage(chatClient.id, message);
          }
        }}
      />

      <SubmissionReport
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onStageChange={(newStage) => {
          if (selectedSubmission) {
            handleStageChange(selectedSubmission.id, newStage);
          }
        }}
        stage={selectedSubmission?.stage || "pending"}
        submission={selectedSubmission}
        onSendReport={handleSendReport}
      />
    </div>
  );
};

export default Index;
