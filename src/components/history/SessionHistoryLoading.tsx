import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SessionHistoryLoading = () => {
  return (
    <Card className="w-full bg-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4 text-muted-foreground">Loading...</div>
      </CardContent>
    </Card>
  );
};