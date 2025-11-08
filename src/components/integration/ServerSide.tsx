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
      install: `npm install @cypherpay/sdk`,
      init: `import CypherPay from '@cypherpay/sdk';

const cypherpay = new CypherPay({
  apiKey: process.env.CYPHERPAY_API_KEY,
  environment: 'production'
});`,
      createOrder: `const order = await cypherpay.orders.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Payment for services',
  customerEmail: 'customer@example.com',
  accountId: process.env.ETHEREUM_ACCOUNT,
  webhookUrl: 'https://yoursite.com/webhook',
  returnUrl: 'https://yoursite.com/success'
});

// Send payment URL to your client
res.json({ paymentUrl: order.paymentUrl });`
    },
    go: {
      install: `go get github.com/cypherpay/cypherpay-go`,
      init: `import "github.com/cypherpay/cypherpay-go"

client := cypherpay.NewClient(
    os.Getenv("CYPHERPAY_API_KEY"),
    cypherpay.Production,
)`,
      createOrder: `order, err := client.Orders.Create(&cypherpay.OrderParams{
    Amount:        100.00,
    Currency:      "USD",
    Description:   "Payment for services",
    CustomerEmail: "customer@example.com",
    AccountID:     os.Getenv("ETHEREUM_ACCOUNT"),
    WebhookURL:    "https://yoursite.com/webhook",
    ReturnURL:     "https://yoursite.com/success",
})

if err != nil {
    log.Fatal(err)
}

// Send payment URL to your client
json.NewEncoder(w).Encode(map[string]string{
    "paymentUrl": order.PaymentURL,
})`
    },
    rust: {
      install: `cargo add cypherpay`,
      init: `use cypherpay::{Client, Environment};

let client = Client::new(
    env::var("CYPHERPAY_API_KEY").unwrap(),
    Environment::Production,
);`,
      createOrder: `let order = client.orders().create(OrderParams {
    amount: 100.0,
    currency: "USD".to_string(),
    description: "Payment for services".to_string(),
    customer_email: "customer@example.com".to_string(),
    account_id: env::var("ETHEREUM_ACCOUNT").unwrap(),
    webhook_url: "https://yoursite.com/webhook".to_string(),
    return_url: "https://yoursite.com/success".to_string(),
}).await?;

// Send payment URL to your client
Json(json!({ "paymentUrl": order.payment_url }))`
    }
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    <TabsTrigger value="go">Go</TabsTrigger>
                    <TabsTrigger value="rust">Rust</TabsTrigger>
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
                          <h3 className="text-sm font-semibold text-foreground">3. Create Payment Order</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(serverSdkCode[lang as keyof typeof serverSdkCode].createOrder, `${lang}-order`, setCopiedCode)}
                          >
                            {copiedCode === `${lang}-order` ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-accent whitespace-pre-wrap">{serverSdkCode[lang as keyof typeof serverSdkCode].createOrder}</pre>
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
                    <span>SDKs for Python, Ruby, PHP, and Java are</span>
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
    )
}