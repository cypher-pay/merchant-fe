import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Wallet, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    setIsLoading(true);
    try{
      const fullPhone = countryCode + phoneNumber;
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        phoneNumber: fullPhone,
        password: password
      });
      if(data.success){
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, `Bearer ${data.token}`);
        toast.success("Signed in successfully");
        setIsLoading(false);
        navigate("/dashboard");
      }else {
        toast.error(data.message || "Failed to sign in. Please try again.");
        setIsLoading(false);
      }
    }catch(err){
      toast.error("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow" style={{ animationDelay: "1s" }} />

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/95 backdrop-blur shadow-card animate-fade-in">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sign In
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Welcome back to CypherPay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number <span className="text-destructive">*</span>
                </Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[120px] bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="5550000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-secondary/50 border-border"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password <span className="text-destructive">*</span>
                </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Shield className="w-4 h-4" />
              <span>Secure authentication</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
