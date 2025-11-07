import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Plus, Copy, Check, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

interface ApiKeysSectionProps {
  fullView?: boolean;
}

const ApiKeysSection = ({ fullView = false }: ApiKeysSectionProps) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production Key",
      key: "sk_live_" + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isKeyRevealModalOpen, setIsKeyRevealModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const createApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewlyCreatedKey(newKey);
    setIsCreateModalOpen(false);
    setIsKeyRevealModalOpen(true);
    setNewKeyName("");
    toast.success("New API key created");
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key deleted");
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 10) + "•".repeat(20) + key.substring(key.length - 4);
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
          {(fullView ? apiKeys : apiKeys.slice(0, 3)).map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{apiKey.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <code className="text-xs text-muted-foreground font-mono block break-all">
                {maskKey(apiKey.key)}
              </code>
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
              onClick={createApiKey}
              className="bg-gradient-primary hover:opacity-90"
            >
              Create Key
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
