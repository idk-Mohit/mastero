import type React from "react";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = "Registration failed";
        try {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } catch {
          throw new Error(msg);
        }
      }

      toast.success("Account created", {
        description: "You can sign in now.",
        action: { label: "Sign in", onClick: () => navigate("/login") },
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      const msg = err?.message ?? "Registration failed";
      setError(msg);
      toast.error("Registration error", { description: msg });
      emailRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-secondary">
      <div className="w-full max-w-sm animate-scale-in">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="glass shadow-2xl border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardHeader className="relative space-y-4 pb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto animate-pulse-slow">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Sign up with your email and password
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div
                  className="grid gap-3 animate-slide-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={emailRef}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-primary transition-all duration-300 hover:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div
                  className="grid gap-3 animate-slide-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-primary transition-all duration-300 hover:border-primary/50"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="animate-slide-in-up bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive text-center font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div
                  className="flex flex-col gap-4 animate-slide-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>

                <div
                  className="mt-6 text-center text-sm animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="text-muted-foreground">
                    Already have an account?{" "}
                  </span>
                  <a
                    href="/login"
                    className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors"
                  >
                    Sign in
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
