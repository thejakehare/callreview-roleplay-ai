import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionHistoryLoading } from "./SessionHistoryLoading";
import { SessionHistoryTable } from "./SessionHistoryTable";
import { useSessionHistory } from "@/hooks/useSessionHistory";

export const SessionHistory = () => {
  const { sessions, loading } = useSessionHistory();

  if (loading) {
    return <SessionHistoryLoading />;
  }

  return (
    <Card className="w-full bg-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <SessionHistoryTable sessions={sessions} />
      </CardContent>
    </Card>
  );
};