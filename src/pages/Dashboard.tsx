import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ApiKeysSection from "@/components/dashboard/ApiKeysSection";
import AccountsSection from "@/components/dashboard/AccountsSection";
import InvoicesSection from "@/components/dashboard/InvoicesSection";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<{ name: string } | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (!token) {
      navigate("/auth");
    } else {
      setIsLoading(true);
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
              setIsLoading(false);
            }else {
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                setIsLoading(false);
                navigate("/auth");
            }
        }catch(err){
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            setIsLoading(false);
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

  if (!merchant && !isLoading) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Sections Loading */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2"
                    >
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
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
          <AccountsSection accounts={accounts} />
          <ApiKeysSection apiKeys={apiKeys} />
          <InvoicesSection invoices={invoices} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
