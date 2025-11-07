import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Integration = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const installCode = `npm install @cypherpay/sdk`;
  
  const initCode = `import CypherPay from '@cypherpay/sdk';

const cypherpay = new CypherPay({
  apiKey: 'your_api_key_here',
  environment: 'production'
});`;

  const createInvoiceCode = `const invoice = await cypherpay.invoices.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Payment for services',
  customerEmail: 'customer@example.com',
  accountId: 'your_account_id',
  webhookUrl: 'https://yoursite.com/webhook'
});

// Redirect to payment page
window.location.href = invoice.paymentUrl;`;

  const webhookCode = `app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-cypherpay-signature'];
  
  // Verify webhook signature
  const isValid = cypherpay.webhooks.verify(
    req.body,
    signature,
    'your_webhook_secret'
  );
  
  if (isValid && req.body.status === 'paid') {
    // Payment successful - fulfill order
    console.log('Payment received:', req.body);
  }
  
  res.status(200).send('OK');
});`;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Integration Guide
          </h1>
          <p className="text-muted-foreground">
            Follow these steps to integrate CypherPay into your application
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="border-border/50 bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <CardTitle>Install the SDK</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(installCode, 1)}
                  className="border-border"
                >
                  {copiedStep === 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CardDescription>
                Install the CypherPay SDK using npm or yarn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <code className="text-accent">{installCode}</code>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-border/50 bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <CardTitle>Initialize the Client</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(initCode, 2)}
                  className="border-border"
                >
                  {copiedStep === 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CardDescription>
                Set up the CypherPay client with your API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <pre className="text-accent whitespace-pre-wrap">{initCode}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-border/50 bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <CardTitle>Create an Invoice</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(createInvoiceCode, 3)}
                  className="border-border"
                >
                  {copiedStep === 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CardDescription>
                Generate a payment invoice for your customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <pre className="text-accent whitespace-pre-wrap">{createInvoiceCode}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-border/50 bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <CardTitle>Handle Webhooks</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(webhookCode, 4)}
                  className="border-border"
                >
                  {copiedStep === 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CardDescription>
                Listen for payment status updates via webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <pre className="text-accent whitespace-pre-wrap">{webhookCode}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Check out our full documentation for more examples and advanced features.
              </p>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                View Full Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integration;
