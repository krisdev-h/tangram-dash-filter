import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterPanel } from "@/components/FilterPanel";
import { SubmissionReport } from "@/components/SubmissionReport";

const Index = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStage, setReportStage] = useState<"pending" | "reviewing" | "report">("pending");

  const handleTriangleClick = () => {
    setReportOpen(true);
  };

  const handleStageChange = (stage: "pending" | "reviewing" | "report") => {
    setReportStage(stage);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🔧 Tangram Internal Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">3 submissions</p>
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
              <FilterPanel />
            </PopoverContent>
          </Popover>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              {reportStage === "pending" && (
                <div 
                  className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={handleTriangleClick}
                >
                  <span className="text-sm font-medium text-foreground">Triangle</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviewing Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Reviewing
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              <div className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">Square</span>
              </div>
              {reportStage === "reviewing" && (
                <div 
                  className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={handleTriangleClick}
                >
                  <span className="text-sm font-medium text-foreground">Triangle</span>
                </div>
              )}
            </div>
          </div>

          {/* Report Column */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Report
            </h2>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[600px] space-y-3">
              <div className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">Circle</span>
              </div>
              {reportStage === "report" && (
                <div 
                  className="bg-secondary border border-border rounded-lg p-4 h-24 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={handleTriangleClick}
                >
                  <span className="text-sm font-medium text-foreground">Triangle</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubmissionReport
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onStageChange={handleStageChange}
        stage={reportStage}
      />
    </div>
  );
};

export default Index;
