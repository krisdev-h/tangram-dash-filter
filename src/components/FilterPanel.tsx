import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterState, SubmissionStage } from "@/types/submission";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleStatusToggle = (status: SubmissionStage) => {
    const newStatuses = filters.selectedStatuses.includes(status)
      ? filters.selectedStatuses.filter((s) => s !== status)
      : [...filters.selectedStatuses, status];
    onFiltersChange({ ...filters, selectedStatuses: newStatuses });
  };

  return (
    <div className="w-[800px] max-h-[600px] overflow-y-auto pb-4">
      <Accordion type="multiple" className="space-y-2">
        {/* Size Filters */}
        <AccordionItem value="size" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Size Filters</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Width */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Width (mm)</Label>
              <Select 
                value={filters.widthOperator} 
                onValueChange={(v) => onFiltersChange({ ...filters, widthOperator: v })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<=">&lt;=</SelectItem>
                  <SelectItem value=">=">&gt;=</SelectItem>
                  <SelectItem value="=">=</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="Enter value" 
                className="w-32" 
                value={filters.widthValue}
                onChange={(e) => onFiltersChange({ ...filters, widthValue: e.target.value })}
              />
            </div>

            {/* Depth */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Depth (mm)</Label>
              <Select 
                value={filters.depthOperator} 
                onValueChange={(v) => onFiltersChange({ ...filters, depthOperator: v })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<=">&lt;=</SelectItem>
                  <SelectItem value=">=">&gt;=</SelectItem>
                  <SelectItem value="=">=</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="Enter value" 
                className="w-32" 
                value={filters.depthValue}
                onChange={(e) => onFiltersChange({ ...filters, depthValue: e.target.value })}
              />
            </div>

            {/* Height */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Height (mm)</Label>
              <Select 
                value={filters.heightOperator} 
                onValueChange={(v) => onFiltersChange({ ...filters, heightOperator: v })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<=">&lt;=</SelectItem>
                  <SelectItem value=">=">&gt;=</SelectItem>
                  <SelectItem value="=">=</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="Enter value" 
                className="w-32" 
                value={filters.heightValue}
                onChange={(e) => onFiltersChange({ ...filters, heightValue: e.target.value })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Order Requirement */}
        <AccordionItem value="order" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Order Requirement</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Quantity */}
            <div className="flex items-center gap-3">
              <Label className="w-32">Quantity</Label>
              <Select 
                value={filters.quantityOperator} 
                onValueChange={(v) => onFiltersChange({ ...filters, quantityOperator: v })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<=">&lt;=</SelectItem>
                  <SelectItem value=">=">&gt;=</SelectItem>
                  <SelectItem value="=">=</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="Enter value" 
                className="w-32" 
                value={filters.quantityValue}
                onChange={(e) => onFiltersChange({ ...filters, quantityValue: e.target.value })}
              />
            </div>

            {/* Production Deadline */}
            <div className="space-y-2">
              <Label>Production Deadline</Label>
              <div className="flex items-center gap-2 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal text-xs",
                        !filters.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.startDate ? format(filters.startDate, "PP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => onFiltersChange({ ...filters, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    className="w-24 text-xs"
                    value={filters.startDate ? format(filters.startDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        onFiltersChange({ ...filters, startDate: date });
                      }
                    }}
                  />
                  <Select 
                    value={filters.deadlineOperator} 
                    onValueChange={(v) => onFiltersChange({ ...filters, deadlineOperator: v })}
                  >
                    <SelectTrigger className="w-16 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<">&lt;</SelectItem>
                      <SelectItem value=">">&gt;</SelectItem>
                      <SelectItem value="<=">&lt;=</SelectItem>
                      <SelectItem value=">=">&gt;=</SelectItem>
                      <SelectItem value="=">=</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal text-xs",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {filters.endDate ? format(filters.endDate, "PP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => onFiltersChange({ ...filters, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="date"
                    className="w-24 text-xs"
                    value={filters.endDate ? format(filters.endDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        onFiltersChange({ ...filters, endDate: date });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Customer Filter */}
        <AccordionItem value="customer" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Customer Filter</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input 
                placeholder="Company name" 
                className="w-full" 
                value={filters.company}
                onChange={(e) => onFiltersChange({ ...filters, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input 
                placeholder="Contact name" 
                className="w-full" 
                value={filters.contactName}
                onChange={(e) => onFiltersChange({ ...filters, contactName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input 
                placeholder="Contact email" 
                className="w-full" 
                value={filters.contactEmail}
                onChange={(e) => onFiltersChange({ ...filters, contactEmail: e.target.value })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filters */}
        <AccordionItem value="status" className="border rounded-md px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Status Filters</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pending"
                checked={filters.selectedStatuses.includes("pending")}
                onCheckedChange={() => handleStatusToggle("pending")}
              />
              <Label htmlFor="pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reviewing"
                checked={filters.selectedStatuses.includes("reviewing")}
                onCheckedChange={() => handleStatusToggle("reviewing")}
              />
              <Label htmlFor="reviewing">Reviewing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="report"
                checked={filters.selectedStatuses.includes("report")}
                onCheckedChange={() => handleStatusToggle("report")}
              />
              <Label htmlFor="report">Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="submitted"
                checked={filters.selectedStatuses.includes("submitted")}
                onCheckedChange={() => handleStatusToggle("submitted")}
              />
              <Label htmlFor="submitted">Submitted</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
        Submit
      </Button>
    </div>
  );
}
