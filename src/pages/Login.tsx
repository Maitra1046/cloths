import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Scroll to top when component mounts
  useScrollToTop();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = await login({ email, password });
    
    if (!success) {
      setError("Invalid email or password. Try admin@beenas.com / password or user@example.com / password");
    }
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-cream px-4 py-16">
        <div className="w-full max-w-md bg-background shadow-soft rounded-sm p-8">
          <h1 className="font-serif text-2xl text-center mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Login to access your account.
          </p>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              Demo credentials:
            </p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Admin: admin@beenas.com / password</p>
              <p>User: user@example.com / password</p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            New customer?{" "}
            <Link to="/signup" className="text-primary underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;


