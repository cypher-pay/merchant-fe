import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Account {
  id: string;
  accountName: string;
  publicKey: string;
  createdAt: string;
}

interface AccountsSectionProps {
  fullView?: boolean;
  accounts?: Account[];
}

const AccountsSection = ({ fullView = false, accounts: fetchedAccounts }: AccountsSectionProps) => {
  const [accounts, setAccounts] = useState<Account[]>(fetchedAccounts || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountName || !publicKey) {
      toast.error("Please fill all fields");
      return;
    }

    if (!publicKey.startsWith("0x")) {
      toast.error("Public key must start with 0x");
      return;
    }

    const newAccount: Account = {
      id: Date.now().toString(),
      accountName,
      publicKey,
      createdAt: new Date().toISOString(),
    };

    setAccounts([...accounts, newAccount]);
    setAccountName("");
    setPublicKey("");
    setIsDialogOpen(false);
    toast.success("Account created successfully");
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
    toast.success("Account deleted");
  };

  return (
    <Card className="border-border/50 bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Manage your wallet accounts</CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Add a new wallet account to receive payments
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g., Business Wallet"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key</Label>
                  <Input
                    id="publicKey"
                    placeholder="0x..."
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    className="bg-secondary/50 border-border font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your wallet's public key (starting with 0x)
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  Create Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </>
        ) : (
          <>
            {(fullView ? accounts : accounts.slice(0, 3)).map((account) => (
          <div
            key={account.id}
            className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{account.accountName}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteAccount(account.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <code className="text-xs text-muted-foreground font-mono block break-all">
              {account.publicKey}
            </code>
            <p className="text-xs text-muted-foreground">
              Created {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>
            ))}
            {!fullView && accounts.length > 3 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => window.location.href = "/dashboard/accounts"}
          >
            Show More ({accounts.length - 3} more)
          </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsSection;
