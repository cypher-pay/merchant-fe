import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  date: string;
}

interface InvoicesSectionProps {
  fullView?: boolean;
  invoices?: Invoice[];
}

const InvoicesSection = ({ fullView = false, invoices: fetchedInvoices }: InvoicesSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const invoices: Invoice[] = [
    {
      id: "INV-001",
      amount: 1250.00,
      status: "paid",
      description: "Payment for Premium Plan",
      date: "2025-01-05",
    },
    {
      id: "INV-002",
      amount: 750.50,
      status: "paid",
      description: "E-commerce Transaction",
      date: "2025-01-04",
    },
    {
      id: "INV-003",
      amount: 2100.00,
      status: "pending",
      description: "Enterprise Package",
      date: "2025-01-03",
    },
    {
      id: "INV-004",
      amount: 450.00,
      status: "paid",
      description: "Monthly Subscription",
      date: "2025-01-02",
    },
  ];

  const totalEarnings = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

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
            <>
              {(fullView ? invoices : invoices.slice(0, 3)).map((invoice) => (
            <div
              key={invoice.id}
              className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {invoice.id}
                  </span>
                  <Badge
                    variant={invoice.status === "paid" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"}
                    className={invoice.status === "paid" ? "bg-success/20 text-success border-success/30" : ""}
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ${invoice.amount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-foreground mb-1">{invoice.description}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
              ))}
              {!fullView && invoices.length > 3 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => window.location.href = "/dashboard/invoices"}
            >
              Show More ({invoices.length - 3} more)
            </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesSection;
