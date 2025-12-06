import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Account {
  id?: string;
  accountName: string;
  publicKey: string;
  createdAt: string;
}

interface AccountsSectionProps {
  fullView?: boolean;
  accounts?: Account[];
}

const AccountsSection = ({ fullView = false }: AccountsSectionProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (!token) {
      navigate("/");
    } else {
      setIsLoading(true);
      const fetchAccountsData = async()=>{
        try{
            const url = fullView ? `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-accounts?limit=10` : `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-accounts?limit=3`;
            const {data} = await axios.get(url, {
              headers: {
                Authorization: token
              }
            });
            if(data.success){
              setAccounts(data.accounts);
              setIsLoading(false);
            }else {
                localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
                toast.error("Failed to fetch your data. Please login again.");
                setIsLoading(false);
                navigate("/");
            }
        }catch(err){
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
            toast.error("Failed to fetch your data. Please login again.");
            setIsLoading(false);
            navigate("/");
        }
      }

      fetchAccountsData();
    }
  }, []);

  const createAccount = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    if (!accountName || !publicKey) {
      toast.error("Please fill all fields");
      setIsCreating(false);
      return;
    }

    if (!publicKey.startsWith("0x")) {
      toast.error("Public key must start with 0x");
      setIsCreating(false);
      return;
    }

    const newAccount: Account = {
      accountName,
      publicKey,
      createdAt: new Date().toISOString(),
    };
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    try{
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/create-account`, newAccount, {
        headers: {
          Authorization: token
        }
      }); 
      if(data.success){
        setAccounts([...accounts, data.account]);
        setAccountName("");
        setPublicKey("");
        setIsDialogOpen(false);
        setIsCreating(false);
        toast.success("Account created successfully");
      }else {
        setIsCreating(false);
        toast.error("Failed to create your account. Please try again.");
      }
    }catch(err){
      setIsCreating(false);
      toast.error("Failed to create your account. Please try again.");
    }
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
                  disabled={isCreating}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account
                </>
              ) : (
                "Create Account"
              )}
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
            key={account.publicKey}
            className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{account.accountName}</span>
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
