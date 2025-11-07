import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ApiKeysSection from "@/components/dashboard/ApiKeysSection";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage all your API keys for integration
          </p>
        </div>
        <ApiKeysSection fullView />
      </div>
    </DashboardLayout>
  );
};

export default ApiKeys;
