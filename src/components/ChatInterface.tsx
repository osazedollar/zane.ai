// src/components/ChatInterface.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileImage from "../assets/profile_image.jpg"
import Logo from "../assets/zane_logo_2.png"
import { HiOutlineLogout } from "react-icons/hi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { logoutLocal } from "@/store/authSlice";
import { logoutThunk } from "@/store/authThunks";
import { fetchProfile } from "@/store/profileThunks";
import { clearProfile } from "@/store/profileSlice";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your shopping assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // pull from profile slice
  const { account } = useSelector((state: RootState) => state.profile);

  // Fetch profile when chat loads
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate assistant reply (replace with backend logic)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder response. and the Creator is Alex Omosigho",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // LOGOUT handler: call server, then clear local state & profile, clear temp storage, navigate
  const handleLogout = async () => {
    try {
      // call server logout - use unwrap() to throw on rejected
      await dispatch(logoutThunk()).unwrap();
    } catch (err) {
      // If server logout fails, we still perform local cleanup (so user is signed out locally).
      console.warn("Server logout failed:", err);
    } finally {
      // Always clear local auth/profile state
      dispatch(logoutLocal());
      dispatch(clearProfile());
      // Remove any temporary persisted items
      localStorage.removeItem("pendingAccountId");
      // navigate to sign-in page (adjust route if your app uses /login)
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src={Logo}
              alt="Zane AI Logo"
              className="w-8 h-8 object-contain rounded-full overflow-hidden cursor-pointer border border-border"
             />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Zane AI</h1>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-border"
              title="Account"
            >
              <img
                src={account?.profilePicture || ProfileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              <img
                src={account?.profilePicture || ProfileImage}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {account?.name || "Pendeet User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {account?.email || "user@example.com"}
                </span>
              </div>
            </div>

            <div className="px-3 pb-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </Button>
            </div>

            <DropdownMenuSeparator />

            {/* Links */}
            <DropdownMenuItem 
              onClick={() => navigate("/help")}
              className="flex gap-3"
            >
              <IoMdHelpCircleOutline className="w-5 h-5"/>
              <span>Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/privacy")}
              className="flex gap-3"
            >
            <MdOutlinePrivacyTip className="w-5 h-5"/>
              <span>Privacy</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-white font-bold bg-red-600"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-ai-message flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-ai-message-foreground" />
                </div>
              )}

              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-user-message text-user-message-foreground"
                    : "bg-ai-message text-ai-message-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-user-message flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-user-message-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-ai-message flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-ai-message-foreground" />
              </div>
              <Card className="bg-ai-message text-ai-message-foreground p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
