import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Server, Globe, Wrench } from "lucide-react";
import { useState } from "react";
import Prerequisites from "@/components/integration/Prerequisites";
import ServerSide from "@/components/integration/ServerSide";
import ClientSide from "@/components/integration/ClientSide";

const Integration = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Integration Guide
          </h1>
          <p className="text-muted-foreground">
            Complete integration in three simple steps
          </p>
        </div>

        <Tabs defaultValue="prerequisites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prerequisites">
              <Wrench className="w-4 h-4 mr-2" />
              Prerequisites
            </TabsTrigger>
            <TabsTrigger value="server">
              <Server className="w-4 h-4 mr-2" />
              Server Integration
            </TabsTrigger>
            <TabsTrigger value="client">
              <Globe className="w-4 h-4 mr-2" />
              Client Integration
            </TabsTrigger>
          </TabsList>

          {/* Prerequisites Section */}
          <Prerequisites />

          {/* Server Integration Section */}
          <ServerSide copiedCode={copiedCode} setCopiedCode={setCopiedCode} />

          {/* Client Integration Section */}
          <ClientSide copiedCode={copiedCode} setCopiedCode={setCopiedCode} />
        </Tabs>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Check out our full documentation for more examples, webhook handling, and advanced features.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              View Full Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Integration;
