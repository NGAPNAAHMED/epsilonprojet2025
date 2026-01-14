import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const stats = [
    { label: "Entreprises", value: "47", icon: Building2, color: "text-blue-600" },
    { label: "Clients actifs", value: "38", icon: Users, color: "text-green-600" },
    { label: "Dossiers en cours", value: "124", icon: FolderOpen, color: "text-orange-600" },
    { label: "Échéances ce mois", value: "12", icon: Calendar, color: "text-red-600" },
  ];

  const recentClients = [
    { id: 1, name: "SARL Tech Innovation", siren: "123 456 789", status: "Actif" },
    { id: 2, name: "SAS Commerce Plus", siren: "987 654 321", status: "Actif" },
    { id: 3, name: "EURL Services Pro", siren: "456 789 123", status: "En attente" },
    { id: 4, name: "SA Industries", siren: "789 123 456", status: "Actif" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Epsilon</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Tableau de bord
          </button>
          <Link
            to="/portfolio"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Building2 className="h-5 w-5" />
            Portefeuille
          </Link>
          <button
            onClick={() => setActiveTab("clients")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === "clients"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <Users className="h-5 w-5" />
            Clients
          </button>
          <Link
            to="/dossiers"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <FolderOpen className="h-5 w-5" />
            Mes Dossiers
          </Link>
          <button
            onClick={() => setActiveTab("documents")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === "documents"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <FileText className="h-5 w-5" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === "stats"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Statistiques
          </button>
        </nav>

        <div className="p-4 border-t space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            Paramètres
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">AD</span>
                  </div>
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem>Mon profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <Link to="/portfolio">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle entreprise
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Clients */}
          <div className="bg-card border rounded-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Entreprises récentes</h2>
              <Link to="/portfolio">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
            <div className="divide-y">
              {recentClients.map((client) => (
                <div key={client.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">SIREN : {client.siren}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.status === "Actif"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
