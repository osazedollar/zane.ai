import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logoutThunk } from "@/store/authThunks";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaMapMarkerAlt, FaQuestionCircle, FaLock } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { account } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="p-6 space-y-6 max-w-md mx-auto">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <img
            src={account?.profilePicture || "/default-avatar.png"}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{account?.name || "Jane. E. Doe"}</h2>
            <p className="text-sm text-muted-foreground">
              {account?.email || "janedoe@pendeet.com"}
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => navigate("/profile-details")}
        >
          View Profile
        </Button>

        {/* Menu Items */}
        <div className="space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <div className="flex items-center space-x-3">
              <FaBoxOpen className="text-primary" />
              <span>My Order</span>
            </div>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/address")}
          >
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-primary" />
              <span>Delivery Address</span>
            </div>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/help")}
          >
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-primary" />
              <span>Help Center</span>
            </div>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/privacy")}
          >
            <div className="flex items-center space-x-3">
              <FaLock className="text-primary" />
              <span>Privacy</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
