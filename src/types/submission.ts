export type SubmissionStage = "pending" | "reviewing" | "report" | "submitted";

export interface Submission {
  id: string;
  name: string;
  shape: string;
  stage: SubmissionStage;
  width: number;
  depth: number;
  height: number;
  quantity: number;
  deadline: string;
  company: string;
  contactName: string;
  contactEmail: string;
}

export interface FilterState {
  widthOperator: string;
  widthValue: string;
  depthOperator: string;
  depthValue: string;
  heightOperator: string;
  heightValue: string;
  quantityOperator: string;
  quantityValue: string;
  deadlineOperator: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  company: string;
  contactName: string;
  contactEmail: string;
  selectedStatuses: SubmissionStage[];
}
