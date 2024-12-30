import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SessionSummaryProps {
  summary: string;
}

export const SessionSummary = ({ summary }: SessionSummaryProps) => {
  return (
    <Card className="bg-accent/50 border-0">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">Summary</span>
        </div>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
};