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
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { Variant_admin_user } from "../../types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const backend = useBackend();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (!backend) {
      toast.error("Connecting to server, please try again.");
      return;
    }

    setLoading(true);
    try {
      const result = await backend.register(username, password);
      if (result.__kind__ === "err") {
        setError(result.err);
      } else {
        // Auto-login after registration
        const loginResult = await backend.login(username, password);
        if (loginResult.__kind__ === "ok") {
          const { username: uname, role } = loginResult.ok;
          const userRole = role === Variant_admin_user.admin ? "admin" : "user";
          login({ username: uname, role: userRole });
          toast.success("Account created! Welcome to PrepStream.");
          navigate({ to: userRole === "admin" ? "/admin" : "/tests" });
        } else {
          toast.success("Account created! Please sign in.");
          navigate({ to: "/login" });
        }
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-slide-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-elevated mb-4">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            PrepStream
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create your free account
          </p>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl">
              Create account
            </CardTitle>
            <CardDescription>
              Register to start creating and practicing tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  data-ocid="register.username.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  data-ocid="register.password.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  data-ocid="register.confirm_password.input"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md"
                  data-ocid="register.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading || !backend}
                data-ocid="register.submit_button"
              >
                {loading ? (
                  <span data-ocid="register.loading_state">
                    Creating account\u2026
                  </span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
                data-ocid="register.login.link"
              >
                Sign in
              </Link>
            </div>

            {/* Full access note */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/8 px-4 py-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Full access included.
                </span>{" "}
                All registered accounts can create, edit, and delete tests and
                questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
