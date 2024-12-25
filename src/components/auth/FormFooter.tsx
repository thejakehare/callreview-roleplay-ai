import { Button } from "@/components/ui/button";

interface FormFooterProps {
  isLogin: boolean;
  loading: boolean;
  onToggleMode: () => void;
}

export const FormFooter = ({ isLogin, loading, onToggleMode }: FormFooterProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={loading}
      >
        {loading ? "Loading..." : isLogin ? "Login" : "Register"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full text-primary hover:text-primary/90"
        onClick={onToggleMode}
      >
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </Button>
    </>
  );
};