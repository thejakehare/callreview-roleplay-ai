export const AuthFooter = () => {
  return (
    <footer className="w-full py-6 px-4 flex items-center justify-center space-x-2 text-muted">
      <span>Powered by</span>
      <a 
        href="https://callreview.ai/?utm_source=roleplayai" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img 
          src="https://wivbfxjqydkozyvlabil.supabase.co/storage/v1/object/public/logos/crai-logo-animated-dark.gif" 
          alt="CallReviewAI Logo" 
          className="h-6" 
        />
      </a>
    </footer>
  );
};