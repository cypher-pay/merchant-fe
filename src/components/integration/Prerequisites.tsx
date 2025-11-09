import { Key, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";

export default function Prerequisites() {
    return (          
    <TabsContent value="prerequisites" className="space-y-6">
            <Card className="border-border/50 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Before You Start
                </CardTitle>
                <CardDescription>
                  Make sure you have the following ready before integrating CypherPay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Create an API Key</h3>
                      <p className="text-sm text-muted-foreground">
                        Navigate to the API Keys section in your dashboard and create a new API key. 
                        Keep this key secure and never share it publicly.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = 'dashboard/api-keys'}>
                        Go to API Keys
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Set Up Ethereum Blockchain Account
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create an Ethereum wallet account to receive payments. You'll need the account address 
                        for integration. We recommend using MetaMask or a similar wallet provider.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                        <li>Install MetaMask or similar Ethereum wallet</li>
                        <li>Create a new account or use existing one</li>
                        <li>Copy your account address (starts with 0x...)</li>
                      </ul>
                      <p className="text-sm text-muted-foreground">
                        Navigate to the Accounts section in your dashboard and create a new account using your Ethereum address.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This is the account where you will receive payments
                      </p>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = 'dashboard/accounts'}>
                        Go to Accounts
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm font-medium text-foreground">
                      ✓ Once you have both your API key and Ethereum account ready, proceed to Server Integration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          );
}