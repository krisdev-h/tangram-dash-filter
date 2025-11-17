import { useState } from "react";
import { X, Plane, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TriangleViewer } from "./TriangleViewer";
import tangramLogo from "@/assets/tangram_logo.jpeg";

type ReportStage = "pending" | "reviewing" | "report";

interface SubmissionReportProps {
  open: boolean;
  onClose: () => void;
  onStageChange: (stage: ReportStage) => void;
  stage: ReportStage;
}

export const SubmissionReport = ({
  open,
  onClose,
  onStageChange,
  stage,
}: SubmissionReportProps) => {
  const [recommendation, setRecommendation] = useState(
    "For a production run of **500 units** with dimensions of **150 mm x 100mm x 75 mm**, **traditional tooling** would be the most **cost-effective method**, with an upfront **mold cost** typically ranging from **$5,000 to $15,000**, depending on complexity. Once the mold is created, the **cost per part** would be very low, around **$1 to $3 per unit**, bringing the total to approximately **$500 to $1,500** for 500 units. In contrast, **3D printing** could be used for smaller runs or complex designs, but at a **higher cost per unit**, typically **$10 to $20 per part** for this size, totaling **$5,000 to $10,000** for 500 units. While 3D printing offers **design flexibility** and **quick iterations**, it's not as efficient for **large-scale production**, making traditional tooling the better choice for this project given the **quantity** and **production deadline**."
  );
  const [isEditingRecommendation, setIsEditingRecommendation] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [executiveSummary, setExecutiveSummary] = useState(
    "This report provides a comprehensive analysis for the production of 500 triangular units. Based on the project requirements and specifications, we recommend traditional tooling as the most cost-effective manufacturing method."
  );
  const [isEditingExecutive, setIsEditingExecutive] = useState(false);

  const [manufacturingDetails, setManufacturingDetails] = useState(
    "Traditional injection molding will be used with aluminum tooling. The process includes mold design, prototype testing, and full production run. Lead time is estimated at 6-8 weeks from approval."
  );
  const [isEditingManufacturing, setIsEditingManufacturing] = useState(false);

  const handleClose = () => {
    if (stage === "pending") {
      onStageChange("reviewing");
    }
    onClose();
  };

  const handleSubmit = () => {
    onStageChange("report");
  };

  const handleSendReport = () => {
    setEmailSent(true);
  };

  const renderBoldText = (text: string) => {
    return text.split("**").map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  if (stage === "pending") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">3D Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <TriangleViewer />

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Project Requirements</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Width (mm):</span> 150</p>
                <p><span className="font-medium">Depth (mm):</span> 100</p>
                <p><span className="font-medium">Height (mm):</span> 75</p>
                <p><span className="font-medium">Quantity:</span> 500</p>
                <p><span className="font-medium">Production Deadline:</span> December 15th, 2025</p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Recommendation</h3>
                  <p className="text-lg font-bold mt-2">Traditional Tooling</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingRecommendation(!isEditingRecommendation)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {isEditingRecommendation ? (
                <Textarea
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-sm leading-relaxed">{renderBoldText(recommendation)}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (stage === "reviewing") {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">3D Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <TriangleViewer />

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Project Requirements</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Width (mm):</span> 150</p>
                <p><span className="font-medium">Depth (mm):</span> 100</p>
                <p><span className="font-medium">Height (mm):</span> 75</p>
                <p><span className="font-medium">Quantity:</span> 500</p>
                <p><span className="font-medium">Production Deadline:</span> December 15th, 2025</p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Recommendation</h3>
                  <p className="text-lg font-bold mt-2">Traditional Tooling</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingRecommendation(!isEditingRecommendation)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {isEditingRecommendation ? (
                <Textarea
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-sm leading-relaxed">{renderBoldText(recommendation)}</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <img src={tangramLogo} alt="Tangram Logo" className="w-48 mx-auto" />

          <div className="border border-border rounded-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Executive Summary</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingExecutive(!isEditingExecutive)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {isEditingExecutive ? (
              <Textarea
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm leading-relaxed">{executiveSummary}</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">3D Visual</h3>
            <TriangleViewer />
          </div>

          <div className="border border-border rounded-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Product Specifications</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 invisible"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Width (mm):</span> 150</p>
              <p><span className="font-medium">Depth (mm):</span> 100</p>
              <p><span className="font-medium">Height (mm):</span> 75</p>
              <p><span className="font-medium">Quantity:</span> 500</p>
              <p><span className="font-medium">Production Deadline:</span> December 15th, 2025</p>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Recommended Manufacturing Method</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingManufacturing(!isEditingManufacturing)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-lg font-bold mb-3">Traditional Tooling</p>
            {isEditingManufacturing ? (
              <Textarea
                value={manufacturingDetails}
                onChange={(e) => setManufacturingDetails(e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm leading-relaxed mb-4">{manufacturingDetails}</p>
            )}
            <p className="text-sm leading-relaxed">{renderBoldText(recommendation)}</p>
          </div>

          <div className="border border-border rounded-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Cost Analysis Summary</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 invisible"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Method</th>
                    <th className="text-left py-2">Upfront Cost</th>
                    <th className="text-left py-2">Cost per Unit</th>
                    <th className="text-left py-2">Total (500 units)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Traditional Tooling</td>
                    <td className="py-2">$5,000 - $15,000</td>
                    <td className="py-2">$1 - $3</td>
                    <td className="py-2">$500 - $1,500</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">3D Printing</td>
                    <td className="py-2">$0</td>
                    <td className="py-2">$10 - $20</td>
                    <td className="py-2">$5,000 - $10,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSendReport}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={emailSent}
            >
              <Plane className="h-4 w-4 mr-2" />
              Send Report
            </Button>
            {emailSent && (
              <p className="text-sm text-muted-foreground text-center">
                This report has been successfully emailed to our clients!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
