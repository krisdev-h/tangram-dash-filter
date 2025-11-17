import { Submission, FilterState, SubmissionStage } from "@/types/submission";

const compareNumber = (value: number, filterValue: number, operator: string): boolean => {
  switch (operator) {
    case "<": return value < filterValue;
    case ">": return value > filterValue;
    case "<=": return value <= filterValue;
    case ">=": return value >= filterValue;
    case "=": return value === filterValue;
    default: return true;
  }
};

const compareDate = (date: Date, filterDate: Date, operator: string): boolean => {
  switch (operator) {
    case "<": return date < filterDate;
    case ">": return date > filterDate;
    case "<=": return date <= filterDate;
    case ">=": return date >= filterDate;
    case "=": return date.toDateString() === filterDate.toDateString();
    default: return true;
  }
};

export const filterSubmissions = (
  submissions: Submission[],
  filters: FilterState
): Submission[] => {
  return submissions.filter((submission) => {
    // Size filters
    if (filters.widthValue && !compareNumber(submission.width, parseFloat(filters.widthValue), filters.widthOperator)) {
      return false;
    }
    if (filters.depthValue && !compareNumber(submission.depth, parseFloat(filters.depthValue), filters.depthOperator)) {
      return false;
    }
    if (filters.heightValue && !compareNumber(submission.height, parseFloat(filters.heightValue), filters.heightOperator)) {
      return false;
    }

    // Quantity filter
    if (filters.quantityValue && !compareNumber(submission.quantity, parseFloat(filters.quantityValue), filters.quantityOperator)) {
      return false;
    }

    // Deadline filter
    const submissionDate = new Date(submission.deadline);
    if (filters.startDate && filters.deadlineOperator) {
      if (!compareDate(submissionDate, filters.startDate, filters.deadlineOperator)) {
        return false;
      }
    }
    if (filters.endDate && filters.startDate) {
      if (submissionDate < filters.startDate || submissionDate > filters.endDate) {
        return false;
      }
    }

    // Customer filters
    if (filters.company && !submission.company.toLowerCase().includes(filters.company.toLowerCase())) {
      return false;
    }
    if (filters.contactName && !submission.contactName.toLowerCase().includes(filters.contactName.toLowerCase())) {
      return false;
    }
    if (filters.contactEmail && !submission.contactEmail.toLowerCase().includes(filters.contactEmail.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(submission.stage)) {
      return false;
    }

    return true;
  });
};
