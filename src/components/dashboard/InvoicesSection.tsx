import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Info, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { truncateHash, weiToEther } from "@/lib/utils";

interface Invoice {
  invoiceId: string;
  amount: string;
  fee: number;
  status: "CONFIRMED" | "PENDING" | "FAILED" | "PAYMENT_PROCESSING";
  createdAt: string;
  tokenAddress: string;
  callbackUrl: string;
  accountName: string;
}

interface InvoicesSectionProps {
  fullView?: boolean;
  invoices?: Invoice[];
}

const InvoicesSection = ({ fullView = false }: InvoicesSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const navigate = useNavigate();
  useEffect(()=>{
      const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      if(!token){
          toast.error("Authentication token missing. Please login again.");
          navigate("/auth");
          return;
      }
      const fetchInvoicesData = async()=>{
        setIsLoading(true);
        try{
            const url = fullView ? `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-invoices` : `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-invoices?limit=3`;
            const {data} = await axios.get(url, {
              headers: {
                Authorization: token
              }
            });
            if(data.success){
              setInvoices(data.invoices);
              setIsLoading(false);
            }else {
                setIsLoading(false);
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                navigate("/auth");
            }
        }catch(err){
            setIsLoading(false);
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            navigate("/auth");
        }
      }

      fetchInvoicesData();
  },[])

  const totalEarnings = invoices
    .filter((inv) => inv.status === "CONFIRMED")
    .reduce((sum, inv) => sum + parseFloat(inv.amount) * (1 - inv.fee/100), 0);

  return (
    <Card className="border-border/50 bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Track your payment history</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>Total Paid</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </>
          ) : (
            <TooltipProvider>
              {(fullView ? invoices : invoices.slice(0, 3)).map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {truncateHash(invoice.invoiceId)}
                      </span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs break-all">
                          <p className="font-mono text-xs">{invoice.invoiceId}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge
                      variant={
                        invoice.status === "CONFIRMED"
                          ? "default"
                          : invoice.status === "PENDING"
                          ? "secondary"
                          : invoice.status === "PAYMENT_PROCESSING"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        invoice.status === "CONFIRMED"
                          ? "bg-success/20 text-success border-success/30"
                          : ""
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-foreground">
                          {weiToEther(invoice.amount)} ETH
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{invoice.amount} wei</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fee:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-foreground">
                          {invoice.fee.toString()} %
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Token:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-foreground">
                          {truncateHash(invoice.tokenAddress, 6, 4)}
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{invoice.tokenAddress}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Account:</span>
                      <span className="text-sm text-foreground font-medium">
                        {invoice.accountName}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
              {!fullView && invoices.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => (window.location.href = "/dashboard/invoices")}
                >
                  Show More ({invoices.length - 3} more)
                </Button>
              )}
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesSection;

