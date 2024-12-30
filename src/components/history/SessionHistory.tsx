import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SessionHistoryLoading } from "./SessionHistoryLoading";
import { SessionHistoryTable } from "./SessionHistoryTable";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Star, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export const SessionHistory = () => {
  const navigate = useNavigate();
  const { sessions, loading } = useSessionHistory();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false);
  const [isToCalendarOpen, setIsToCalendarOpen] = useState(false);

  if (loading) {
    return <SessionHistoryLoading />;
  }

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.created_at);
    const matchesDateRange = (!dateFrom || sessionDate >= dateFrom) && 
                           (!dateTo || sessionDate <= dateTo);
    const matchesFavorites = !showFavoritesOnly || session.is_favorite;
    return matchesDateRange && matchesFavorites;
  });

  return (
    <Card className="w-full bg-card border-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-4">
              <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      setDateFrom(date);
                      setIsFromCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      setDateTo(date);
                      setIsToCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="favorites-filter"
                checked={showFavoritesOnly}
                onCheckedChange={setShowFavoritesOnly}
              />
              <Label htmlFor="favorites-filter" className="flex items-center cursor-pointer">
                <Star className="mr-2 h-4 w-4" />
                Show favorites only
              </Label>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate("/roleplay")}
            className="whitespace-nowrap"
          >
            <Play className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SessionHistoryTable sessions={filteredSessions} />
      </CardContent>
    </Card>
  );
};