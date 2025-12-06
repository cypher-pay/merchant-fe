import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Key, Wallet, FileText, LogOut, Menu, X, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Key, label: "API Keys", path: "/dashboard/api-keys" },
    { icon: Users, label: "Accounts", path: "/dashboard/accounts" },
    { icon: FileText, label: "Invoices", path: "/dashboard/invoices" },
    { icon: FileText, label: "Integration", path: "/integration" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/50 backdrop-blur hidden lg:block transition-all duration-300 ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}>
        <div className="flex h-full flex-col">
          <div className={`flex h-16 items-center border-b border-border/50 ${
            isSidebarCollapsed ? "justify-center px-2" : "gap-2 px-6"
          }`}>
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CypherPay
              </span>
            )}
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full gap-3 ${
                    isSidebarCollapsed ? "justify-center px-2" : "justify-start"
                  } ${
                    isActive 
                      ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => navigate(item.path)}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          <div className="border-t border-border/50 p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full gap-3 text-muted-foreground hover:text-foreground ${
                isSidebarCollapsed ? "justify-center px-2" : "justify-start"
              }`}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className={`w-full gap-3 border-border text-muted-foreground hover:text-destructive hover:border-destructive ${
                isSidebarCollapsed ? "justify-center px-2" : "justify-start"
              }`}
              onClick={handleLogout}
              title={isSidebarCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-card/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CypherPay
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur pt-16">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive 
                      ? "bg-gradient-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-border text-muted-foreground hover:text-destructive mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`pt-16 lg:pt-0 transition-all duration-300 ${
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
