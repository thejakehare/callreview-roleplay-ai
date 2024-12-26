import { Camera } from "lucide-react";
import { FormInput } from "./FormInput";
import { UserInfoFields } from "./UserInfoFields";
import { RoleSelector } from "./RoleSelector";
import { AuthFields } from "./AuthFields";

interface RegistrationFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegistrationFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  accountName,
  setAccountName,
  role,
  setRole,
  email,
  setEmail,
  password,
  setPassword,
  onAvatarChange,
}: RegistrationFieldsProps) => {
  return (
    <>
      <FormInput
        type="file"
        label="Profile Picture (Optional)"
        accept="image/*"
        onChange={onAvatarChange}
        icon={Camera}
        value=""
      />

      <UserInfoFields
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        accountName={accountName}
        setAccountName={setAccountName}
      />

      <RoleSelector role={role} setRole={setRole} />

      <AuthFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </>
  );
};