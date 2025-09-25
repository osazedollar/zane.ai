import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Verified = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6 space-y-4 text-center">
        <h2 className="text-2xl font-bold text-green-600">✅ Verified!</h2>
        <p className="text-muted-foreground text-sm">
          Your account has been successfully verified.
        </p>
        <Button onClick={() => navigate("/chat")} className="w-full">
          Continue to Chat
        </Button>
      </Card>
    </div>
  );
};

export default Verified;
