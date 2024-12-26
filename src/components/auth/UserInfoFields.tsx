import { User, Users } from "lucide-react";
import { FormInput } from "./FormInput";

interface UserInfoFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
}

export const UserInfoFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  accountName,
  setAccountName,
}: UserInfoFieldsProps) => {
  return (
    <>
      <FormInput
        type="text"
        label="First Name"
        placeholder="Enter your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        icon={User}
        required
      />

      <FormInput
        type="text"
        label="Last Name"
        placeholder="Enter your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        icon={User}
        required
      />

      <FormInput
        type="text"
        label="Account Name (Optional)"
        placeholder="Enter your account name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        icon={Users}
      />
    </>
  );
};