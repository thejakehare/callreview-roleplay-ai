import { Button } from "@/components/ui/button";
import { AccountSelect } from "./AccountSelect";
import { EmailInput } from "./EmailInput";
import { useInvitation } from "@/hooks/useInvitation";

export const InvitationForm = () => {
  const {
    email,
    setEmail,
    selectedAccountId,
    setSelectedAccountId,
    loading,
    adminAccounts,
    loadingAccounts,
    handleInvite,
  } = useInvitation();

  if (loadingAccounts) {
    return <div>Loading accounts...</div>;
  }

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <AccountSelect
        accounts={adminAccounts.map(a => ({ id: a.accounts.id, name: a.accounts.name }))}
        selectedAccountId={selectedAccountId}
        onSelect={setSelectedAccountId}
      />

      <EmailInput 
        email={email}
        onChange={setEmail}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !selectedAccountId}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </Button>
    </form>
  );
};