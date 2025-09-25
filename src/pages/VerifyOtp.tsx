import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { verifyOtpThunk } from "../store/authThunks";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { otpSuccess, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

    // Redirect when OTP is successfully verified
    useEffect(() => {
    if (otpSuccess) {
        // Clear the temporary accountId
        localStorage.removeItem("pendingAccountId");
        navigate("/verified");
    }
    }, [otpSuccess, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setLocalError("Enter a valid 4-digit code.");
      return;
    }

    // Get accountId from localStorage or Redux (depending on how you saved it in registerThunk response)
    const accountId = localStorage.getItem("pendingAccountId");
    if (!accountId) {
      setLocalError("Missing accountId. Please register again.");
      return;
    }

    const result = await dispatch(verifyOtpThunk({ accountId, otp }));
    if (verifyOtpThunk.rejected.match(result)) {
      setLocalError(result.payload as string || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6 space-y-4 text-center">
        <h2 className="text-xl font-bold">Verify OTP</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 4-digit code sent to your email.
        </p>
        <Input
          maxLength={4}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="text-center text-2xl tracking-widest"
          placeholder="____"
        />
        {(localError || error) && (
          <p className="text-sm text-red-500">{localError || error}</p>
        )}
        <Button onClick={handleVerify} className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Card>
    </div>
  );
};

export default VerifyOtp;
