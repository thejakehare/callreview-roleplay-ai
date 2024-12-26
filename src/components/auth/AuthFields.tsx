import { FormInput } from "./FormInput";

interface AuthFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

export const AuthFields = ({
  email,
  setEmail,
  password,
  setPassword,
}: AuthFieldsProps) => {
  return (
    <>
      <FormInput
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <FormInput
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </>
  );
};