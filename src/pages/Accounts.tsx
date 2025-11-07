import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AccountsSection from "@/components/dashboard/AccountsSection";

const Accounts = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Accounts</h1>
          <p className="text-muted-foreground">
            Manage all your payment accounts
          </p>
        </div>
        <AccountsSection fullView />
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
