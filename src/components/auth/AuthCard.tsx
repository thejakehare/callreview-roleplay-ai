import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <Card className="w-[400px] bg-card border-0">
      <CardHeader>
        <CardTitle className="text-foreground text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};