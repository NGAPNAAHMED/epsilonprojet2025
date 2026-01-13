import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion - à remplacer par vraie auth
    setTimeout(() => {
      if (email === "admin@epsilon.fr" && password === "admin") {
        toast.success("Connexion réussie !");
        navigate("/admin");
      } else if (email === "client@epsilon.fr" && password === "client") {
        toast.success("Connexion réussie !");
        navigate("/client");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <Building2 className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">Epsilon</span>
          </Link>

          <h1 className="text-2xl font-semibold text-center mb-2">Connexion</h1>
          <p className="text-muted-foreground text-center mb-6">
            Accédez à votre espace de gestion
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Comptes de démo :</p>
            <p className="text-xs text-muted-foreground">
              Admin : admin@epsilon.fr / admin
            </p>
            <p className="text-xs text-muted-foreground">
              Client : client@epsilon.fr / client
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
