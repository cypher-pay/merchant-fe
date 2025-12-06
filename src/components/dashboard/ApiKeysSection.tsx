import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Plus, Copy, Check, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ApiKey {
  id?: string;
  name: string;
  environment: "LIVE" | "TEST";
  key?: string;
  createdAt: string;
}

interface ApiKeysSectionProps {
  fullView?: boolean;
}

const ApiKeysSection = ({ fullView = false }: ApiKeysSectionProps) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isKeyRevealModalOpen, setIsKeyRevealModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

    useEffect(() => {
    const fetchApiKeys = async () => {
      const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        navigate('/');
        return;
      }
      try {

        const url = fullView ? `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-api-keys?limit=10` : `${import.meta.env.VITE_BACKEND_URL}/api/merchant/get-merchant-api-keys?limit=3`;
        const { data } = await axios.get(url, {
          headers: {
            Authorization: token
          }
        });
        if (data.success) {
          setApiKeys(data.apiKeys);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to fetch API keys");
        setLoading(false);
      }
    }

    fetchApiKeys();
  }, []);

  const createApiKey = async () => {
    setIsCreating(true);
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      setIsCreating(false);
      return;
    }

    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

    try{
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/create-api-key`, {
        name: newKeyName,
      }, {
        headers: {
          Authorization: token
        }
      });

      if(data.success){
        const createdApiKey : ApiKey = {
          id: data.apiKey.id,
          name: data.apiKey.name,
          environment: data.apiKey.environment,
          createdAt: data.apiKey.createdAt,
        } 
        const newCreatedKey : ApiKey = {
          id: data.apiKey.id,
          name: data.apiKey.name,
          environment: data.apiKey.environment,
          key: data.apiKey.key,
          createdAt: data.apiKey.createdAt,
        }
        setApiKeys([...apiKeys, createdApiKey]);
        setNewlyCreatedKey(newCreatedKey);
        setIsCreateModalOpen(false);
        setIsKeyRevealModalOpen(true);
        setNewKeyName("");
        toast.success("New API key created");
      }else {
        setIsCreating(false);
        toast.error("Failed to create API key. Please try again.");
        return;
      }

    }catch(err){
      setIsCreating(false);
      toast.error("Failed to create API key. Please try again.");
      return;
    }

  };

  const deleteApiKey = async (id: string) => {
    setDeletingKeyId(id);
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    try{
      const {data} = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/merchant/delete-api-key/${id}`, {
        headers: {
          Authorization: token
        }
      });
      if(data.success){
        setDeletingKeyId(null);
        setApiKeys(apiKeys.filter((key) => key.id !== id));
        toast.success("API key deleted");
      }else{
        setDeletingKeyId(null);
        toast.error("Failed to delete API key. Please try again.");
      }
    }
    catch(err){
      setDeletingKeyId(null);
      toast.error("Failed to delete API key. Please try again.");
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <>
      <Card className="border-border/50 bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
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
              {(fullView ? apiKeys : apiKeys.slice(0, 3)).map((apiKey) => (
            <div
              key={apiKey.name}
              className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{apiKey.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  disabled={deletingKeyId === apiKey.id}
                >
                {deletingKeyId === apiKey.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {new Date(apiKey.createdAt).toLocaleDateString()}
              </p>
            </div>
              ))}
              {!fullView && apiKeys.length > 3 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => window.location.href = "/dashboard/api-keys"}
            >
              Show More ({apiKeys.length - 3} more)
            </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Enter a name for your new API key
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewKeyName("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isCreating}
              onClick={createApiKey}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating API key
                </>
              ) : (
                "Create Key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Key Reveal Modal (One-time display) */}
      <Dialog open={isKeyRevealModalOpen} onOpenChange={setIsKeyRevealModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Copy and save this key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
              <div className="flex items-start gap-2 text-sm text-yellow-500">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Make sure to copy this key now. For security reasons, you won't be able to view it again.
                </p>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 rounded bg-background border border-border text-xs font-mono break-all">
                    {newlyCreatedKey?.key}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => newlyCreatedKey && copyToClipboard(newlyCreatedKey.key)}
                    className="flex-shrink-0"
                  >
                    {copiedKey === newlyCreatedKey?.key ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsKeyRevealModalOpen(false);
                setNewlyCreatedKey(null);
              }}
              className="bg-gradient-primary hover:opacity-90"
            >
              I've Saved the Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeysSection;
