import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, Wallet } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if(token){
        navigate("/dashboard");
    }
  },[])
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try{
        const fullPhoneNumber = countryCode + phoneNumber;
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-otp`, { phoneNumber: fullPhoneNumber });
        if(data.success){
            const userExists = data.userExists;
            setIsExistingUser(userExists);
            setStep("verify");
            setIsLoading(false);
            toast.success("OTP sent to your phone number");
            return;
        }else {
            toast.error("Failed to send OTP. Please try again.");
        }
    }catch(error){
        toast.error("Failed to send OTP. Please try again.");
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!isExistingUser && !name) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try{
        const originalPhoneNumber = countryCode + phoneNumber;
        const payload = isExistingUser ? {
            phoneNumber: originalPhoneNumber,
            otp,
        } : {
            name,
            phoneNumber: originalPhoneNumber,
            otp,
        }
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, payload);

        if(data.success){
            // Set the token and then navigate to dashboard
            const token = data.token;
            localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, `Bearer ${token}`);
            if(!isExistingUser){
                toast.success("Account created successfully!");
            } else {
                toast.success("Login Successful!");
            }
            setIsLoading(false);
            navigate("/dashboard");
            return;
        }else {
            toast.error("OTP Verification failed. Please try again.");
            setIsLoading(false);
            return;
        }
    }catch(error){
        toast.error("An error occurred. Please try again.");
        setIsLoading(false);
        return;
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
            CypherPay
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === "phone" 
              ? "Enter your phone number to continue" 
              : isExistingUser 
                ? "Enter the OTP sent to your phone"
                : "Complete your registration"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {!isExistingUser && (
                <div className="space-y-2 animate-slide-up">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary/50 border-border"
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground">OTP Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Demo OTP: 123456
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setName("");
                  }}
                  className="flex-1 border-border"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : isExistingUser ? "Login" : "Register"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Shield className="w-4 h-4" />
              <span>Secure authentication with OTP verification</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
