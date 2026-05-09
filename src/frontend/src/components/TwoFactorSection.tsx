/**
 * 2FA management section for the ProfileModal.
 * Handles: status display, setup flow (QR + secret + confirm), disable flow.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface TwoFactorSectionProps {
  username: string;
  /** Whether 2FA is currently enabled for this user. */
  enabled: boolean;
  /** Called with the new enabled state after a successful operation. */
  onStatusChange: (enabled: boolean) => void;
  backend: {
    getTwoFAStatus(username: string): Promise<boolean>;
    setup2FA(
      username: string,
    ): Promise<
      | { __kind__: "ok"; ok: [string, string] }
      | { __kind__: "err"; err: string }
    >;
    enable2FA(
      username: string,
      code: string,
    ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
    disable2FA(
      username: string,
      password: string,
      code: string,
    ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  };
}

type Flow = "idle" | "setup" | "disable";

export function TwoFactorSection({
  username,
  enabled,
  onStatusChange,
  backend,
}: TwoFactorSectionProps) {
  const [flow, setFlow] = useState<Flow>("idle");

  // Setup state
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [secret, setSecret] = useState("");
  const [uri, setUri] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Disable state
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisablePassword, setShowDisablePassword] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState("");
  const [disableSuccess, setDisableSuccess] = useState(false);

  // Generate QR code data URL whenever uri changes
  useEffect(() => {
    if (!uri) return;
    QRCode.toDataURL(uri, { width: 200, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null));
  }, [uri]);

  async function handleSetupStart() {
    setSetupError("");
    setSetupLoading(true);
    setSetupCode("");
    setConfirmError("");
    setSetupSuccess(false);
    try {
      const result = await backend.setup2FA(username);
      if (result.__kind__ === "ok") {
        const [sec, otpUri] = result.ok;
        setSecret(sec);
        setUri(otpUri);
        setFlow("setup");
      } else {
        setSetupError(result.err);
      }
    } catch {
      setSetupError("Failed to start 2FA setup. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  }

  async function handleEnable(e: React.FormEvent) {
    e.preventDefault();
    setConfirmError("");
    if (setupCode.length !== 6) {
      setConfirmError("Enter the 6-digit code from Google Authenticator.");
      return;
    }
    setConfirmLoading(true);
    try {
      const result = await backend.enable2FA(username, setupCode);
      if (result.__kind__ === "ok") {
        setSetupSuccess(true);
        onStatusChange(true);
        setTimeout(() => {
          setFlow("idle");
          setSetupSuccess(false);
          setSetupCode("");
        }, 2500);
      } else {
        setConfirmError(result.err);
        setSetupCode("");
      }
    } catch {
      setConfirmError("Verification failed. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleDisable(e: React.FormEvent) {
    e.preventDefault();
    setDisableError("");
    if (!disablePassword) {
      setDisableError("Current password is required.");
      return;
    }
    if (disableCode.length !== 6) {
      setDisableError("Enter the 6-digit code from Google Authenticator.");
      return;
    }
    setDisableLoading(true);
    try {
      const result = await backend.disable2FA(
        username,
        disablePassword,
        disableCode,
      );
      if (result.__kind__ === "ok") {
        setDisableSuccess(true);
        onStatusChange(false);
        setTimeout(() => {
          setFlow("idle");
          setDisableSuccess(false);
          setDisablePassword("");
          setDisableCode("");
        }, 2500);
      } else {
        setDisableError(result.err);
        setDisableCode("");
      }
    } catch {
      setDisableError("Failed to disable 2FA. Please try again.");
    } finally {
      setDisableLoading(false);
    }
  }

  function handleCopySecret() {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function cancelFlow() {
    setFlow("idle");
    setSetupCode("");
    setConfirmError("");
    setSetupError("");
    setDisablePassword("");
    setDisableCode("");
    setDisableError("");
    setSetupSuccess(false);
    setDisableSuccess(false);
  }

  return (
    <div className="space-y-4" data-ocid="profile.2fa.section">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-semibold text-foreground">
          Two-Factor Authentication
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            enabled
              ? "bg-accent/15 text-accent"
              : "bg-muted text-muted-foreground"
          }`}
          data-ocid="profile.2fa.status"
        >
          {enabled ? (
            <>
              <ShieldCheck className="w-3 h-3" />
              Enabled
            </>
          ) : (
            <>
              <ShieldOff className="w-3 h-3" />
              Disabled
            </>
          )}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Use Google Authenticator or any TOTP app to add an extra layer of
        security to your account.
      </p>

      {/* ── IDLE STATE ── */}
      {flow === "idle" && (
        <>
          {setupError && (
            <p
              className="text-sm text-destructive"
              data-ocid="profile.2fa.setup.error_state"
            >
              {setupError}
            </p>
          )}
          {enabled ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDisableError("");
                setDisableCode("");
                setDisablePassword("");
                setFlow("disable");
              }}
              data-ocid="profile.2fa.disable_button"
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              Disable 2FA
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSetupStart}
              disabled={setupLoading}
              data-ocid="profile.2fa.setup_button"
              className="gap-2"
            >
              {setupLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <QrCode className="w-3.5 h-3.5" />
              )}
              {setupLoading ? "Setting up…" : "Set Up 2FA"}
            </Button>
          )}
        </>
      )}

      {/* ── SETUP FLOW ── */}
      {flow === "setup" && (
        <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Scan with Authenticator
            </p>
            <button
              type="button"
              onClick={cancelFlow}
              aria-label="Cancel 2FA setup"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="profile.2fa.setup.cancel_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open Google Authenticator on your phone.</li>
            <li>
              Tap the <strong className="text-foreground">+</strong> button and
              choose <strong className="text-foreground">Scan QR code</strong>.
            </li>
            <li>Scan the code below or enter the secret manually.</li>
            <li>Enter the 6-digit code displayed in the app to confirm.</li>
          </ol>

          {/* QR Code */}
          <div className="flex justify-center" data-ocid="profile.2fa.qr_code">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan this QR code with Google Authenticator"
                width={160}
                height={160}
                className="rounded-lg border border-border bg-card p-1"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg border border-border bg-muted flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Manual secret */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Manual entry key
            </Label>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs tracking-widest text-foreground truncate select-all"
                data-ocid="profile.2fa.secret"
              >
                {secret}
              </code>
              <button
                type="button"
                onClick={handleCopySecret}
                aria-label="Copy secret key"
                className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                data-ocid="profile.2fa.copy_secret_button"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm code */}
          {setupSuccess ? (
            <div
              className="flex items-center gap-2 text-sm text-accent"
              data-ocid="profile.2fa.setup.success_state"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              2FA enabled successfully!
            </div>
          ) : (
            <form onSubmit={handleEnable} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Confirm with authenticator code
                </Label>
                <div
                  className="flex justify-center"
                  data-ocid="profile.2fa.setup.code_input"
                >
                  <InputOTP
                    maxLength={6}
                    value={setupCode}
                    onChange={(v) => setSetupCode(v)}
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
              </div>

              {confirmError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.2fa.setup.confirm.error_state"
                >
                  {confirmError}
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={confirmLoading || setupCode.length !== 6}
                data-ocid="profile.2fa.enable_button"
                className="w-full gap-2"
              >
                {confirmLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                {confirmLoading ? "Enabling…" : "Enable 2FA"}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* ── DISABLE FLOW ── */}
      {flow === "disable" && (
        <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Disable Two-Factor Auth
            </p>
            <button
              type="button"
              onClick={cancelFlow}
              aria-label="Cancel disable 2FA"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="profile.2fa.disable.cancel_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {disableSuccess ? (
            <div
              className="flex items-center gap-2 text-sm text-accent"
              data-ocid="profile.2fa.disable.success_state"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              2FA has been disabled.
            </div>
          ) : (
            <form onSubmit={handleDisable} className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="disable-password"
                  className="text-xs text-muted-foreground"
                >
                  Current password
                </Label>
                <div className="relative">
                  <Input
                    id="disable-password"
                    type={showDisablePassword ? "text" : "password"}
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="••••••••"
                    data-ocid="profile.2fa.disable.password_input"
                    className="bg-input/50 pr-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDisablePassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-fast"
                    aria-label={
                      showDisablePassword ? "Hide password" : "Show password"
                    }
                  >
                    {showDisablePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Authenticator code
                </Label>
                <div
                  className="flex justify-center"
                  data-ocid="profile.2fa.disable.code_input"
                >
                  <InputOTP
                    maxLength={6}
                    value={disableCode}
                    onChange={(v) => setDisableCode(v)}
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
              </div>

              {disableError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.2fa.disable.error_state"
                >
                  {disableError}
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                variant="destructive"
                disabled={
                  disableLoading || !disablePassword || disableCode.length !== 6
                }
                data-ocid="profile.2fa.disable.confirm_button"
                className="w-full gap-2"
              >
                {disableLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldOff className="w-3.5 h-3.5" />
                )}
                {disableLoading ? "Disabling…" : "Disable 2FA"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
