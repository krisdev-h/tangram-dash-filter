import { useState } from "react";
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

type Operator = "<" | ">" | "<=" | ">=" | "=";

export function FilterPanel() {
  const [widthOperator, setWidthOperator] = useState<Operator>("=");
  const [depthOperator, setDepthOperator] = useState<Operator>("=");
  const [heightOperator, setHeightOperator] = useState<Operator>("=");
  const [quantityOperator, setQuantityOperator] = useState<Operator>("=");
  const [deadlineOperator, setDeadlineOperator] = useState<Operator>("=");
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="w-[800px] max-h-[600px] overflow-y-auto">
      <Accordion type="multiple" className="space-y-2">
        {/* Size Filters */}
        <AccordionItem value="size" className="border rounded-full px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Size Filters</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Width */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Width (mm)</Label>
              <Select value={widthOperator} onValueChange={(v) => setWidthOperator(v as Operator)}>
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
              <Input type="number" placeholder="Enter value" className="w-32" />
            </div>

            {/* Depth */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Depth (mm)</Label>
              <Select value={depthOperator} onValueChange={(v) => setDepthOperator(v as Operator)}>
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
              <Input type="number" placeholder="Enter value" className="w-32" />
            </div>

            {/* Height */}
            <div className="flex items-center gap-3">
              <Label className="w-24">Height (mm)</Label>
              <Select value={heightOperator} onValueChange={(v) => setHeightOperator(v as Operator)}>
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
              <Input type="number" placeholder="Enter value" className="w-32" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Order Requirement */}
        <AccordionItem value="order" className="border rounded-full px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Order Requirement</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Quantity */}
            <div className="flex items-center gap-3">
              <Label className="w-40">Quantity</Label>
              <Select value={quantityOperator} onValueChange={(v) => setQuantityOperator(v as Operator)}>
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
              <Input type="number" placeholder="Enter quantity" className="w-32" />
            </div>

            {/* Production Deadline */}
            <div className="space-y-2">
              <Label>Production Deadline</Label>
              <div className="flex items-center gap-3 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="w-32"
                  value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                  onChange={(e) => {
                    const parts = e.target.value.split("/");
                    if (parts.length === 3) {
                      const [day, month, year] = parts.map(Number);
                      const date = new Date(year, month - 1, day);
                      if (!isNaN(date.getTime())) setStartDate(date);
                    }
                  }}
                />

                <Select value={deadlineOperator} onValueChange={(v) => setDeadlineOperator(v as Operator)}>
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

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="w-32"
                  value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                  onChange={(e) => {
                    const parts = e.target.value.split("/");
                    if (parts.length === 3) {
                      const [day, month, year] = parts.map(Number);
                      const date = new Date(year, month - 1, day);
                      if (!isNaN(date.getTime())) setEndDate(date);
                    }
                  }}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Customer Filter */}
        <AccordionItem value="customer" className="border rounded-full px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Customer Filter</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Type or select companies" />
            </div>
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input placeholder="Type or select contact names" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input placeholder="Type or select contact emails" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filters */}
        <AccordionItem value="status" className="border rounded-full px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="text-sm font-medium">Status Filters</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pending"
                checked={selectedStatuses.includes("pending")}
                onCheckedChange={() => handleStatusToggle("pending")}
              />
              <Label htmlFor="pending" className="cursor-pointer">
                Pending
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reviewing"
                checked={selectedStatuses.includes("reviewing")}
                onCheckedChange={() => handleStatusToggle("reviewing")}
              />
              <Label htmlFor="reviewing" className="cursor-pointer">
                Reviewing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="report"
                checked={selectedStatuses.includes("report")}
                onCheckedChange={() => handleStatusToggle("report")}
              />
              <Label htmlFor="report" className="cursor-pointer">
                Report
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
