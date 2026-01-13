import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  FolderOpen,
  FileText,
  Calendar,
  LogOut,
  Bell,
  ChevronDown,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const ClientDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  // Informations de l'entreprise du client
  const entreprise = {
    denomination: "SARL Tech Innovation",
    formeJuridique: "SARL",
    siren: "123 456 789",
    siret: "123 456 789 00012",
    siegeSocial: "15 Rue de l'Innovation, 75001 Paris",
    capitalSocial: "50 000 €",
    dateCreation: "15/03/2018",
    codeNAF: "6201Z",
    activite: "Programmation informatique",
    dirigeant: "Jean Dupont",
    email: "contact@tech-innovation.fr",
    telephone: "01 23 45 67 89",
  };

  const documents = [
    { id: 1, name: "Bilan 2024", type: "PDF", date: "15/01/2025", status: "Disponible" },
    { id: 2, name: "Liasse fiscale 2024", type: "PDF", date: "10/01/2025", status: "Disponible" },
    { id: 3, name: "Déclaration TVA T4 2024", type: "PDF", date: "20/01/2025", status: "En cours" },
    { id: 4, name: "Compte de résultat 2024", type: "PDF", date: "15/01/2025", status: "Disponible" },
  ];

  const echeances = [
    { id: 1, label: "Déclaration TVA", date: "20/01/2025", status: "urgent" },
    { id: 2, label: "Acompte IS", date: "15/03/2025", status: "normal" },
    { id: 3, label: "Déclaration résultat", date: "15/05/2025", status: "normal" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Epsilon</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">JD</span>
                  </div>
                  <span>Jean Dupont</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem>Mon profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Mon espace client</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Informations Entreprise */}
          <div className="lg:col-span-2 bg-card border rounded-xl">
            <div className="p-4 border-b flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Mon entreprise</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{entreprise.denomination}</h3>
                  <p className="text-muted-foreground">{entreprise.formeJuridique} - {entreprise.activite}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">SIREN</p>
                    <p className="font-medium">{entreprise.siren}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SIRET</p>
                    <p className="font-medium">{entreprise.siret}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Code NAF</p>
                    <p className="font-medium">{entreprise.codeNAF}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capital social</p>
                    <p className="font-medium">{entreprise.capitalSocial}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Siège social</p>
                    <p className="font-medium">{entreprise.siegeSocial}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">{entreprise.dateCreation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dirigeant</p>
                    <p className="font-medium">{entreprise.dirigeant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{entreprise.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Échéances */}
          <div className="bg-card border rounded-xl">
            <div className="p-4 border-b flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Prochaines échéances</h2>
            </div>
            <div className="divide-y">
              {echeances.map((echeance) => (
                <div key={echeance.id} className="p-4 flex items-center gap-3">
                  {echeance.status === "urgent" ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{echeance.label}</p>
                    <p className={`text-sm ${echeance.status === "urgent" ? "text-destructive" : "text-muted-foreground"}`}>
                      {echeance.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-6 bg-card border rounded-xl">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Mes documents</h2>
            </div>
          </div>
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.type} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === "Disponible" ? (
                    <>
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Disponible
                      </span>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      En cours
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
