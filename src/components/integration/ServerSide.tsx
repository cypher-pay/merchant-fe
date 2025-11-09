import { CheckCircle2, Code, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

export default function ServerSide({copiedCode, setCopiedCode}: {copiedCode: string | null, setCopiedCode: (id: string | null) => void}) {
  const [selectedServerLang, setSelectedServerLang] = useState<string>("nodejs");

  const serverSdkCode = {
    nodejs: {
      install: `npm install @cypher-pay/nodejs`,
      init: `import CypherPay from '@cypher-pay/nodejs';

const cypherPay = new CypherPay('<Your Cypher Pay API Key>', {
    baseURL: '<Backend URL of CypherPay>',
    timeout: 5000,
});`,
      createInvoice: `const invoice = await cypherpay.invoices.create({
  amount: '<Amount in wei>', // Currently only wei is supported
  callbackUrl: '<Your webhook URL>', // This should accept a POST request
  accountName: '<Your account name created in Cypher Pay>',
});

// Send invoice to your client
res.json({ invoice });
`
    },
  };
    return (
        <TabsContent value="server" className="space-y-6">
            <Card className="border-border/50 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Choose Your Server-Side SDK</CardTitle>
                <CardDescription>
                  Select your preferred programming language for backend integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedServerLang} onValueChange={setSelectedServerLang}>
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                  </TabsList>

                  {Object.keys(serverSdkCode).map((lang) => (
                    <TabsContent key={lang} value={lang} className="space-y-6 mt-6">
                      {/* Install SDK */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">1. Install SDK</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(serverSdkCode[lang as keyof typeof serverSdkCode].install, `${lang}-install`, setCopiedCode)}
                          >
                            {copiedCode === `${lang}-install` ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                          <code className="text-accent">{serverSdkCode[lang as keyof typeof serverSdkCode].install}</code>
                        </div>
                      </div>

                      {/* Initialize */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">2. Initialize Client</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(serverSdkCode[lang as keyof typeof serverSdkCode].init, `${lang}-init`, setCopiedCode)}
                          >
                            {copiedCode === `${lang}-init` ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-accent whitespace-pre-wrap">{serverSdkCode[lang as keyof typeof serverSdkCode].init}</pre>
                        </div>
                      </div>

                      {/* Create Order */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">3. Create Invoice for an Order</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(serverSdkCode[lang as keyof typeof serverSdkCode].createInvoice, `${lang}-order`, setCopiedCode)}
                          >
                            {copiedCode === `${lang}-order` ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-accent whitespace-pre-wrap">{serverSdkCode[lang as keyof typeof serverSdkCode].createInvoice}</pre>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Important:</strong> Store your API key and Ethereum account in environment variables. 
                          Never hardcode sensitive credentials in your source code.
                        </p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Code className="w-4 h-4" />
                    <span>SDKs for Go, Rust, Python, Ruby, PHP, and Java are</span>
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
    )
}