import { Link } from "react-router-dom";
import { Building2, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Epsilon</span>
          </div>
          <Link to="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Gestion de Cabinet Comptable
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Plateforme complète pour la gestion de vos dossiers clients, 
            le suivi des entreprises et la collaboration avec vos équipes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Commencer <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Portefeuille Entreprises</h3>
            <p className="text-muted-foreground">
              Gérez toutes les informations de vos entreprises clientes : 
              dénomination, siège social, forme juridique, capital social.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Espace Client</h3>
            <p className="text-muted-foreground">
              Offrez à vos clients un accès sécurisé pour consulter leurs dossiers, 
              documents et échéances.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Administration</h3>
            <p className="text-muted-foreground">
              Interface d'administration complète pour gérer les utilisateurs, 
              les dossiers et les accès.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Epsilon - Gestion de Cabinet Comptable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
