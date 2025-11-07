import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText, Wallet } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Total Earnings",
      value: "$12,426.00",
      change: "+12.5%",
      icon: DollarSign,
      gradient: "from-primary to-accent",
    },
    {
      title: "Total Invoices",
      value: "143",
      change: "+8 this week",
      icon: FileText,
      gradient: "from-accent to-primary",
    },
    {
      title: "Active Accounts",
      value: "5",
      change: "All verified",
      icon: Wallet,
      gradient: "from-success to-accent",
    },
    {
      title: "Success Rate",
      value: "98.2%",
      change: "+2.4%",
      icon: TrendingUp,
      gradient: "from-primary to-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border-border/50 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-glow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-success">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
