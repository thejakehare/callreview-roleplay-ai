import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface LoginErrorDisplayProps {
  error: string | null;
}

export const LoginErrorDisplay = ({ error }: LoginErrorDisplayProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};