import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { signinThunk, registerThunk } from "../store/authThunks";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ZaneLogo from "../assets/zane_logo_2.png";

const Index = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { account, loading, error, isRegistered } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect after successful login
  useEffect(() => {
    if (account) navigate("/chat");
  }, [account, navigate]);

  // Redirect after successful registration → OTP
  useEffect(() => {
    if (isRegistered) {
      navigate("/verify-otp");
    }
  }, [isRegistered, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password.trim()) return;

    if (isSignUp) {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }

      // Dispatch the registration thunk
      const result = await dispatch(registerThunk({ email, password }));
      if (registerThunk.rejected.match(result)) {
        setLocalError(result.payload as string || "Registration failed");
      }
    } else {
      // Dispatch the sign-in thunk
      const result = await dispatch(signinThunk({ email, password }));
      if (signinThunk.rejected.match(result)) {
        setLocalError(result.payload as string || "Sign in failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <img
              src={ZaneLogo}
              alt="Zane Logo"
              className="h-12 w-auto animate-spin-slow"
            />
            <h1 className="text-2xl font-bold">Zane AI</h1>
          </div>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account to get started." : "Sign in to continue."}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {/* Errors */}
          {(localError || error) && (
            <p className="text-sm text-red-500 text-center">
              {localError || error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? isSignUp
                ? "Signing Up..."
                : "Signing In..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </form>

        {/* Toggle Sign In/Sign Up */}
        <div className="text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setLocalError("");
                }}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setLocalError("");
                }}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Index;
