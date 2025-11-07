import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InvoicesSection from "@/components/dashboard/InvoicesSection";

const Invoices = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Invoices</h1>
          <p className="text-muted-foreground">
            View all your transaction history and earnings
          </p>
        </div>
        <InvoicesSection fullView />
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
