import { CheckCircle2, Copy, Globe, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

export default function ClientSide({copiedCode, setCopiedCode}: {copiedCode: string | null, setCopiedCode: (id: string | null) => void}) {
    const [selectedClient, setSelectedClient] = useState<string>("website");
    const clientCode = {
        website: {
        html: `<!-- Add this to your checkout page -->
    <div id="cypherpay-button"></div>

    <script src="https://cdn.cypherpay.com/v1/cypherpay.js"></script>
    <script>
    CypherPay.init({
        containerId: 'cypherpay-button',
        onPaymentRequest: async () => {
        // Call your backend to create order
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 100, currency: 'USD' })
        });
        const { paymentUrl } = await response.json();
        return paymentUrl;
        },
        onSuccess: (orderId) => {
        console.log('Payment successful:', orderId);
        window.location.href = '/success';
        },
        onError: (error) => {
        console.error('Payment failed:', error);
        }
    });
    </script>`,
        react: `import { CypherPayButton } from '@cypherpay/react';

    function CheckoutPage() {
    const handlePaymentRequest = async () => {
        const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, currency: 'USD' })
        });
        const { paymentUrl } = await response.json();
        return paymentUrl;
    };

    return (
        <CypherPayButton
        onPaymentRequest={handlePaymentRequest}
        onSuccess={(orderId) => {
            console.log('Payment successful:', orderId);
        }}
        onError={(error) => {
            console.error('Payment failed:', error);
        }}
        />
    );
    }`
        },
        android: {
        gradle: `// Add to your app/build.gradle
    dependencies {
        implementation 'com.cypherpay:android-sdk:1.0.0'
    }`,
        kotlin: `import com.cypherpay.sdk.CypherPay
    import com.cypherpay.sdk.CypherPayButton

    class CheckoutActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            val cypherPayButton = CypherPayButton(this)
            
            cypherPayButton.setOnPaymentRequestListener {
                // Call your backend to create order
                val paymentUrl = createOrder()
                paymentUrl
            }
            
            cypherPayButton.setOnSuccessListener { orderId ->
                Log.d("CypherPay", "Payment successful: $orderId")
                // Navigate to success screen
            }
            
            cypherPayButton.setOnErrorListener { error ->
                Log.e("CypherPay", "Payment failed: $error")
            }
        }
        
        private suspend fun createOrder(): String {
            // Implement your backend call here
            return apiService.createOrder(amount = 100.0, currency = "USD")
        }
    }`
        }
    };
    return (
        <TabsContent value="client" className="space-y-6">
        <Card className="border-border/50 bg-gradient-card shadow-card">
            <CardHeader>
            <CardTitle>Choose Your Client Platform</CardTitle>
            <CardDescription>
                Integrate CypherPay payment modal into your client application
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Tabs value={selectedClient} onValueChange={setSelectedClient}>
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="website">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                </TabsTrigger>
                <TabsTrigger value="android">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Android
                </TabsTrigger>
                </TabsList>

                {/* Website Integration */}
                <TabsContent value="website" className="space-y-6 mt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Vanilla HTML/JavaScript</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.website.html, 'website-html', setCopiedCode)}
                    >
                        {copiedCode === 'website-html' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.website.html}</pre>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">React Component</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.website.react, 'website-react', setCopiedCode)}
                    >
                        {copiedCode === 'website-react' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.website.react}</pre>
                    </div>
                </div>
                </TabsContent>

                {/* Android Integration */}
                <TabsContent value="android" className="space-y-6 mt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">1. Add Dependency</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.android.gradle, 'android-gradle', setCopiedCode)}
                    >
                        {copiedCode === 'android-gradle' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.android.gradle}</pre>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">2. Integrate Payment Button</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.android.kotlin, 'android-kotlin', setCopiedCode)}
                    >
                        {copiedCode === 'android-kotlin' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.android.kotlin}</pre>
                    </div>
                </div>
                </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>iOS, Flutter, and React Native SDKs are</span>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
            </div>
            </CardContent>
        </Card>
        </TabsContent>
    )
}