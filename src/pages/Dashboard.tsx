import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ApiKeysSection from "@/components/dashboard/ApiKeysSection";
import AccountsSection from "@/components/dashboard/AccountsSection";
import InvoicesSection from "@/components/dashboard/InvoicesSection";
import axios from "axios";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<{ name: string } | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (!token) {
      navigate("/auth");
    } else {
      const fetchAccountsData = async()=>{
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-accounts?limit=3`, {
              headers: {
                Authorization: token
              }
            });
            if(data.success){
              setAccounts(data.accounts);
              setMerchant({name: data.merchantName});
            }else {
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                navigate("/auth");
            }
        }catch(err){
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            navigate("/auth");
        }
      }
      const fetchInvoicesData = async()=>{
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-invoices?limit=3`, {
              headers: {
                Authorization: token
              }
            });
            if(data.success){
              setInvoices(data.invoices);
            }else {
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                navigate("/auth");
            }
        }catch(err){
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            navigate("/auth");
        }
      }
      const fetchApiKeysData = async()=>{
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-api-keys?limit=3`, {
              headers: {
                Authorization: token
              }
            });
            if(data.success){
              setApiKeys(data.apiKeys);
            }else {
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                navigate("/auth");
            }
        }catch(err){
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            navigate("/auth");
        }
      }

      fetchAccountsData();
      fetchInvoicesData();
      fetchApiKeysData();

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
        
        <div className="space-y-6">
          <AccountsSection />
          <ApiKeysSection />
          <InvoicesSection />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
