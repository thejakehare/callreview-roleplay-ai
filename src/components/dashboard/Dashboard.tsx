import { SessionHistory } from "@/components/history/SessionHistory";

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-12 px-4 space-y-8 flex-grow">
        <div className="grid md:grid-cols-1 gap-8">
          <SessionHistory />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-muted-foreground">Powered by</span>
        <a 
          href="https://callreview.ai/?utm_source=roleplayai" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="https://wivbfxjqydkozyvlabil.supabase.co/storage/v1/object/public/logos/crai-logo-animated-dark.gif" 
            alt="CallReviewAI Logo" 
            className="h-8"
          />
        </a>
      </div>
    </div>
  );
};