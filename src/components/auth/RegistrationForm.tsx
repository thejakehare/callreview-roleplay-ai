import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RegistrationFields } from "./RegistrationFields";
import { useRegistration } from "@/hooks/useRegistration";

interface RegistrationFormProps {
  onBack: () => void;
}

export const RegistrationForm = ({ onBack }: RegistrationFormProps) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    accountName,
    setAccountName,
    loading,
    avatar,
    setAvatar,
    role,
    setRole,
    email,
    setEmail,
    password,
    setPassword,
    handleRegistration,
  } = useRegistration();

  return (
    <form onSubmit={handleRegistration} className="space-y-4">
      <RegistrationFields
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        accountName={accountName}
        setAccountName={setAccountName}
        role={role}
        setRole={setRole}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onAvatarChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
          }
        }}
      />

      <div className="space-y-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full text-primary hover:text-primary/90 text-sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      </div>
    </form>
  );
};