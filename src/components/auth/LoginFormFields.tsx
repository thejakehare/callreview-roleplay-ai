import { FormInput } from "./FormInput";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginFormFields = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginFormFieldsProps) => {
  return (
    <>
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        required
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={onPasswordChange}
        required
      />
    </>
  );
};