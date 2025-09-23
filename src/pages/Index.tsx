import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowWelcome(false);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai-api-key", key);
    setShowWelcome(false);
  };

  const handleGetStarted = (key: string) => {
    if (!key.trim()) return;
    handleApiKeyChange(key);
  };

  if (showWelcome || !apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              Zane AI
              <Sparkles className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-muted-foreground">
              Your intelligent AI assistant powered by OpenAI
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-api-key">OpenAI API Key</Label>
              <Input
                id="welcome-api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleGetStarted(apiKey);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never shared
              </p>
            </div>
            
            <Button 
              onClick={() => handleGetStarted(apiKey)}
              disabled={!apiKey.trim()}
              className="w-full"
            >
              Get Started
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Don't have an API key?{" "}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Get one from OpenAI
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return <ChatInterface apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />;
};

export default Index;
