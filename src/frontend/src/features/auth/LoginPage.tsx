import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  LogIn,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { Variant_admin_user } from "../../types";

type LoginStep = "credentials" | "totp";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const backend = useBackend();

  // Step 1 – credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2 – TOTP
  const [step, setStep] = useState<LoginStep>("credentials");
  const [totpUsername, setTotpUsername] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState("");

  function redirectAfterLogin(role: string) {
    if (role === Variant_admin_user.admin) {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/tests" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!backend) {
      toast.error("Connecting to server, please try again.");
      return;
    }
    setLoading(true);
    try {
      const result = await backend.login(username, password);
      if (result.__kind__ === "err") {
        setError(result.err);
      } else if (result.__kind__ === "accountDeactivated") {
        setError(
          "Your account has been deactivated. Please contact an administrator.",
        );
      } else if (result.__kind__ === "requiresTOTP") {
        // 2FA required — move to TOTP step
        setTotpUsername(username);
        setTotpCode("");
        setTotpError("");
        setStep("totp");
      } else {
        const { username: uname, role, displayName } = result.ok;
        login({
          username: uname,
          role: role === Variant_admin_user.admin ? "admin" : "user",
          displayName: displayName ?? undefined,
        });
        toast.success(`Welcome back, ${uname}!`);
        redirectAfterLogin(role);
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTOTPVerify(e: React.FormEvent) {
    e.preventDefault();
    setTotpError("");
    if (!backend) {
      toast.error("Connecting to server, please try again.");
      return;
    }
    if (totpCode.length !== 6) {
      setTotpError(
        "Please enter the 6-digit code from your authenticator app.",
      );
      return;
    }
    setTotpLoading(true);
    try {
      const result = await backend.verifyTOTPLogin(totpUsername, totpCode);
      if (result.__kind__ === "ok") {
        const { username: uname, role, displayName } = result.ok;
        login({
          username: uname,
          role: role === Variant_admin_user.admin ? "admin" : "user",
          displayName: displayName ?? undefined,
        });
        toast.success(`Welcome back, ${uname}!`);
        redirectAfterLogin(role);
      } else {
        setTotpError(result.err);
        setTotpCode("");
      }
    } catch {
      setTotpError("Verification failed. Please try again.");
    } finally {
      setTotpLoading(false);
    }
  }

  function handleBackToCredentials() {
    setStep("credentials");
    setTotpCode("");
    setTotpError("");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-slide-in-up">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-elevated mb-4">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            PrepStream
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Practice smarter, score higher
          </p>
        </div>

        {step === "credentials" ? (
          <Card className="shadow-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    data-ocid="login.username.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    data-ocid="login.password.input"
                  />
                </div>

                {error && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading || !backend}
                  data-ocid="login.submit_button"
                >
                  {loading ? (
                    <span data-ocid="login.loading_state">
                      Signing in\u2026
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                  data-ocid="login.register.link"
                >
                  Register
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">
                  Two-Factor Authentication
                </CardTitle>
              </div>
              <CardDescription>
                Enter the 6-digit code from your Google Authenticator app to
                continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTOTPVerify} className="space-y-5">
                <div className="space-y-3">
                  <Label>Authenticator Code</Label>
                  <div
                    className="flex justify-center"
                    data-ocid="login.totp.input"
                  >
                    <InputOTP
                      maxLength={6}
                      value={totpCode}
                      onChange={(v) => setTotpCode(v)}
                      inputMode="numeric"
                    >
                      <InputOTPGroup>
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
                    Open Google Authenticator and enter the current 6-digit
                    code.
                  </p>
                </div>

                {totpError && (
                  <p
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md"
                    data-ocid="login.totp.error_state"
                  >
                    {totpError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={totpLoading || totpCode.length !== 6 || !backend}
                  data-ocid="login.totp.submit_button"
                >
                  {totpLoading ? (
                    <span data-ocid="login.totp.loading_state">
                      Verifying\u2026
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Verify Code
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                  data-ocid="login.totp.back_button"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Getting started hint — only on credentials step */}
        {step === "credentials" && (
          <div
            className="mt-4 flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/8 px-4 py-3"
            data-ocid="login.info_hint"
          >
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-semibold text-foreground leading-snug">
                Get started
              </p>
              <p className="text-muted-foreground mt-0.5">
                Register to create an account and start practicing tests.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
