import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import ApiKeysSection from "@/components/dashboard/ApiKeysSection";
import AccountsSection from "@/components/dashboard/AccountsSection";
import InvoicesSection from "@/components/dashboard/InvoicesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    const currentMerchant = localStorage.getItem("currentMerchant");
    if (!currentMerchant) {
      navigate("/auth");
    } else {
      setMerchant(JSON.parse(currentMerchant));
    }
  }, [navigate]);

  if (!merchant) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {merchant.name}
          </h1>
          <p className="text-muted-foreground">
            Manage your payment gateway and track your earnings
          </p>
        </div>

        <StatsCards />
        
        <div className="space-y-6">
          <ApiKeysSection />
          <AccountsSection />
          <InvoicesSection />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
