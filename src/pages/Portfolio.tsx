import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Euro,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Entreprise {
  id: number;
  denomination: string;
  formeJuridique: string;
  siren: string;
  siret: string;
  siegeSocial: string;
  codePostal: string;
  ville: string;
  capitalSocial: string;
  dateCreation: string;
  codeNAF: string;
  activite: string;
  dirigeant: string;
  email: string;
  telephone: string;
  status: "Actif" | "Inactif" | "En attente";
  collaborateur: string;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [entreprises, setEntreprises] = useState<Entreprise[]>([
    {
      id: 1,
      denomination: "SARL Tech Innovation",
      formeJuridique: "SARL",
      siren: "123 456 789",
      siret: "123 456 789 00012",
      siegeSocial: "15 Rue de l'Innovation",
      codePostal: "75001",
      ville: "Paris",
      capitalSocial: "50 000",
      dateCreation: "15/03/2018",
      codeNAF: "6201Z",
      activite: "Programmation informatique",
      dirigeant: "Jean Dupont",
      email: "contact@tech-innovation.fr",
      telephone: "01 23 45 67 89",
      status: "Actif",
      collaborateur: "Marie Martin",
    },
    {
      id: 2,
      denomination: "SAS Commerce Plus",
      formeJuridique: "SAS",
      siren: "987 654 321",
      siret: "987 654 321 00015",
      siegeSocial: "28 Avenue du Commerce",
      codePostal: "69002",
      ville: "Lyon",
      capitalSocial: "100 000",
      dateCreation: "08/06/2015",
      codeNAF: "4711F",
      activite: "Commerce de détail",
      dirigeant: "Sophie Bernard",
      email: "contact@commerce-plus.fr",
      telephone: "04 56 78 90 12",
      status: "Actif",
      collaborateur: "Pierre Durand",
    },
    {
      id: 3,
      denomination: "EURL Services Pro",
      formeJuridique: "EURL",
      siren: "456 789 123",
      siret: "456 789 123 00018",
      siegeSocial: "5 Place des Services",
      codePostal: "33000",
      ville: "Bordeaux",
      capitalSocial: "10 000",
      dateCreation: "22/09/2020",
      codeNAF: "7022Z",
      activite: "Conseil de gestion",
      dirigeant: "Marc Lefebvre",
      email: "contact@services-pro.fr",
      telephone: "05 12 34 56 78",
      status: "En attente",
      collaborateur: "Marie Martin",
    },
    {
      id: 4,
      denomination: "SA Industries Modernes",
      formeJuridique: "SA",
      siren: "789 123 456",
      siret: "789 123 456 00022",
      siegeSocial: "Zone Industrielle Nord",
      codePostal: "59000",
      ville: "Lille",
      capitalSocial: "500 000",
      dateCreation: "12/01/2010",
      codeNAF: "2562B",
      activite: "Mécanique industrielle",
      dirigeant: "François Moreau",
      email: "contact@industries-modernes.fr",
      telephone: "03 21 43 65 87",
      status: "Actif",
      collaborateur: "Pierre Durand",
    },
    {
      id: 5,
      denomination: "SARL Restaurant du Parc",
      formeJuridique: "SARL",
      siren: "321 654 987",
      siret: "321 654 987 00011",
      siegeSocial: "12 Allée du Parc",
      codePostal: "13001",
      ville: "Marseille",
      capitalSocial: "25 000",
      dateCreation: "05/04/2019",
      codeNAF: "5610A",
      activite: "Restauration traditionnelle",
      dirigeant: "Isabelle Petit",
      email: "contact@restaurant-parc.fr",
      telephone: "04 91 23 45 67",
      status: "Inactif",
      collaborateur: "Marie Martin",
    },
  ]);

  const filteredEntreprises = entreprises.filter((e) => {
    const matchesSearch =
      e.denomination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.siren.includes(searchTerm) ||
      e.ville.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-700";
      case "Inactif":
        return "bg-gray-100 text-gray-700";
      case "En attente":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = (id: number) => {
    setEntreprises(entreprises.filter((e) => e.id !== id));
    toast.success("Entreprise supprimée");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Portefeuille</span>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle entreprise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une entreprise</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Entreprise ajoutée avec succès");
                  setIsAddDialogOpen(false);
                }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="denomination">Dénomination sociale *</Label>
                    <Input id="denomination" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forme">Forme juridique *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="sarl">SARL</SelectItem>
                        <SelectItem value="sas">SAS</SelectItem>
                        <SelectItem value="eurl">EURL</SelectItem>
                        <SelectItem value="sa">SA</SelectItem>
                        <SelectItem value="sasu">SASU</SelectItem>
                        <SelectItem value="sci">SCI</SelectItem>
                        <SelectItem value="ei">EI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siren">SIREN *</Label>
                    <Input id="siren" placeholder="XXX XXX XXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siret">SIRET *</Label>
                    <Input id="siret" placeholder="XXX XXX XXX XXXXX" required />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="adresse">Siège social *</Label>
                    <Input id="adresse" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cp">Code postal *</Label>
                    <Input id="cp" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville *</Label>
                    <Input id="ville" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital">Capital social (€)</Label>
                    <Input id="capital" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date de création</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="naf">Code NAF</Label>
                    <Input id="naf" placeholder="XXXXZ" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activite">Activité</Label>
                    <Input id="activite" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dirigeant">Dirigeant</Label>
                    <Input id="dirigeant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collaborateur">Collaborateur assigné</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="marie">Marie Martin</SelectItem>
                        <SelectItem value="pierre">Pierre Durand</SelectItem>
                        <SelectItem value="sophie">Sophie Bernard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tel">Téléphone</Label>
                    <Input id="tel" type="tel" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, SIREN ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total entreprises</p>
            <p className="text-2xl font-bold">{entreprises.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Actives</p>
            <p className="text-2xl font-bold text-green-600">
              {entreprises.filter((e) => e.status === "Actif").length}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {entreprises.filter((e) => e.status === "En attente").length}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Inactives</p>
            <p className="text-2xl font-bold text-gray-600">
              {entreprises.filter((e) => e.status === "Inactif").length}
            </p>
          </div>
        </div>

        {/* Enterprises List */}
        <div className="grid gap-4">
          {filteredEntreprises.map((entreprise) => (
            <div
              key={entreprise.id}
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Main Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">{entreprise.denomination}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entreprise.status)}`}>
                        {entreprise.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {entreprise.formeJuridique}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1">{entreprise.activite}</p>

                    {/* Details Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">SIREN :</span>
                        <span className="font-medium">{entreprise.siren}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{entreprise.ville} ({entreprise.codePostal})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span>{entreprise.capitalSocial} €</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{entreprise.dateCreation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{entreprise.dirigeant}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{entreprise.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{entreprise.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Collaborateur :</span>
                        <span className="font-medium">{entreprise.collaborateur}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEntreprise(entreprise)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Détails
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(entreprise.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}

          {filteredEntreprises.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune entreprise trouvée</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntreprise} onOpenChange={() => setSelectedEntreprise(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              {selectedEntreprise?.denomination}
            </DialogTitle>
          </DialogHeader>
          {selectedEntreprise && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEntreprise.status)}`}>
                  {selectedEntreprise.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {selectedEntreprise.formeJuridique}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Dénomination sociale</p>
                    <p className="font-medium">{selectedEntreprise.denomination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SIREN</p>
                    <p className="font-medium">{selectedEntreprise.siren}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SIRET</p>
                    <p className="font-medium">{selectedEntreprise.siret}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Code NAF</p>
                    <p className="font-medium">{selectedEntreprise.codeNAF}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Activité</p>
                    <p className="font-medium">{selectedEntreprise.activite}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Siège social</p>
                    <p className="font-medium">
                      {selectedEntreprise.siegeSocial}<br />
                      {selectedEntreprise.codePostal} {selectedEntreprise.ville}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capital social</p>
                    <p className="font-medium">{selectedEntreprise.capitalSocial} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">{selectedEntreprise.dateCreation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dirigeant</p>
                    <p className="font-medium">{selectedEntreprise.dirigeant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collaborateur assigné</p>
                    <p className="font-medium">{selectedEntreprise.collaborateur}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Contact</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEntreprise.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEntreprise.telephone}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEntreprise(null)}>
                  Fermer
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
