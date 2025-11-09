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
        addSDK: `<!-- Place the following <script> tag in the <head> or just before the closing </body> tag of your HTML page where you want to initiate payments. -->

<script src="https://cdn.cypherpay.com/v1/cypherpay.umd.cjs"></script>
    `,
        paymentModal: `
<!-- Initiate the cypherPay sdk in the <script> tag -->

<script>

/* 
Initialize the CypherPay SDK with required parameters

@parmas checkoutHost : URL of the CypherPay modal (provided by CypherPay)
@parmas onClose : (optional) callback function when the modal is closed
@parmas onError : (optional) callback function when an error occurs when fetching invoice details
@parmas onProcessing : (optional) callback function when the payment is sent to the blockchain

*/
const cypherPay = new CypherPay({
    checkoutHost: 'URL of the CypherPay modal',
    onClose: ()=>void, 
    onError: (error : {type : 'FETCHING_INVOICE_DETAILS', message : string})=> void,
    onProcessing: (data : {hash : string})=> void
});

/* 
Fetch the invoiceId of the payment generated from your backend server (from the setup done in server side integration)
*/
const invoiceId = '<Invoice ID from your backend>';

/*
This will open the payment modal and the user can connect to his wallet and complete the payment
*/
cypherPay.open(invoiceId);
</script>
`
        },
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
                <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="website">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                </TabsTrigger>
                </TabsList>

                {/* Website Integration */}
                <TabsContent value="website" className="space-y-6 mt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">1. Include the CypherPay SDK in your HTML</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.website.addSDK, 'website-add-sdk', setCopiedCode)}
                    >
                        {copiedCode === 'website-add-sdk' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.website.addSDK}</pre>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">2. Initiate the Payment Modal</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clientCode.website.paymentModal, 'website-payment-modal', setCopiedCode)}
                    >
                        {copiedCode === 'website-payment-modal' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-accent whitespace-pre-wrap">{clientCode.website.paymentModal}</pre>
                    </div>
                </div>
                </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>Android, iOS, Flutter, and React Native SDKs are</span>
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
            </div>
            </CardContent>
        </Card>
        </TabsContent>
    )
}