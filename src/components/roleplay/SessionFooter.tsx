export const SessionFooter = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <span className="text-muted-foreground">Powered by</span>
      <img 
        src="https://wivbfxjqydkozyvlabil.supabase.co/storage/v1/object/public/logos/crai-logo-animated-dark.gif" 
        alt="CallReviewAI Logo" 
        className="h-8"
      />
    </div>
  );
};