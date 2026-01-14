import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  FolderOpen,
  Search,
  Filter,
  Eye,
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  Download,
  Send,
  TrendingUp,
  TrendingDown,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Gauge from "@/components/ui/gauge";
import RadarChart from "@/components/ui/radar-chart";
import { generateAnalysisReportPDF } from "@/lib/pdfGenerator";
import {
  Dossier,
  calculateScore,
  checkBlocking,
  generateRecommendations,
  generateStrengths,
} from "@/lib/scoring";
import { toast } from "sonner";

const MesDossiers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [showDetailedNote, setShowDetailedNote] = useState(false);

  const [dossiers] = useState<Dossier[]>([
    {
      id: 1,
      clientName: "Jean-Pierre Kouassi",
      clientType: "physical",
      creditAmount: 5000000,
      duration: 24,
      periodicity: "monthly",
      purpose: "Fonds de roulement",
      guaranteeValue: 6500000,
      monthlyIncome: 850000,
      monthlyExpenses: 280000,
      existingCredits: 0,
      score: 82,
      status: "approved",
      dateCreated: "2025-01-10",
      centraleRisques: {
        status: "clean",
        incidents: [],
      },
      riskFactors: [
        { label: "DSR", value: 75, max: 100, weight: 30 },
        { label: "Garanties", value: 85, max: 100, weight: 25 },
        { label: "Historique", value: 100, max: 100, weight: 25 },
        { label: "Profil", value: 70, max: 100, weight: 20 },
      ],
      strengths: [
        "Revenus stables et réguliers",
        "Aucun incident à la Centrale des Risques",
        "Garanties solides (130% de couverture)",
      ],
      weaknesses: [],
      recommendations: ["Dossier approuvé - Procéder au décaissement"],
      blockingReasons: [],
    },
    {
      id: 2,
      clientName: "Marie-Claire Bamba",
      clientType: "physical",
      creditAmount: 3000000,
      duration: 18,
      periodicity: "monthly",
      purpose: "Équipement professionnel",
      guaranteeValue: 2200000,
      monthlyIncome: 520000,
      monthlyExpenses: 180000,
      existingCredits: 500000,
      score: 68,
      status: "rejected",
      dateCreated: "2025-01-08",
      centraleRisques: {
        status: "incidents",
        incidents: [
          {
            bank: "Banque Atlantique",
            amount: 1500000,
            outstanding: 800000,
            risk: "medium",
            status: "active",
          },
        ],
      },
      riskFactors: [
        { label: "DSR", value: 55, max: 100, weight: 30 },
        { label: "Garanties", value: 60, max: 100, weight: 25 },
        { label: "Historique", value: 60, max: 100, weight: 25 },
        { label: "Profil", value: 65, max: 100, weight: 20 },
      ],
      strengths: ["Objet du crédit bien défini"],
      weaknesses: [
        "Crédit en cours chez un autre établissement",
        "Garanties insuffisantes",
      ],
      recommendations: [
        "Apporter une garantie supplémentaire de 800 000 FCFA",
        "Régulariser le crédit chez Banque Atlantique",
      ],
      blockingReasons: [
        "Score insuffisant (68/100 < 75)",
        "Crédit actif à la Centrale des Risques",
      ],
    },
    {
      id: 3,
      clientName: "Société COFINA SARL",
      clientType: "enterprise",
      creditAmount: 25000000,
      duration: 36,
      periodicity: "monthly",
      purpose: "Extension d'activité",
      guaranteeValue: 32000000,
      monthlyIncome: 4500000,
      monthlyExpenses: 2800000,
      existingCredits: 0,
      score: 78,
      status: "approved",
      dateCreated: "2025-01-12",
      centraleRisques: {
        status: "clean",
        incidents: [],
      },
      riskFactors: [
        { label: "DSR", value: 70, max: 100, weight: 30 },
        { label: "Garanties", value: 90, max: 100, weight: 25 },
        { label: "Historique", value: 100, max: 100, weight: 25 },
        { label: "Profil", value: 65, max: 100, weight: 20 },
      ],
      strengths: [
        "Entreprise bien établie",
        "Garanties excellentes (128% couverture)",
        "Pas d'historique négatif",
      ],
      weaknesses: ["Charges d'exploitation élevées"],
      recommendations: [
        "Surveiller les charges mensuelles",
        "Établir un plan de trésorerie",
      ],
      blockingReasons: [],
    },
    {
      id: 4,
      clientName: "Paul Yao",
      clientType: "physical",
      creditAmount: 8000000,
      duration: 24,
      periodicity: "monthly",
      purpose: "Achat véhicule professionnel",
      guaranteeValue: 4500000,
      monthlyIncome: 650000,
      monthlyExpenses: 220000,
      existingCredits: 2000000,
      score: 52,
      status: "rejected",
      dateCreated: "2025-01-05",
      centraleRisques: {
        status: "incidents",
        incidents: [
          {
            bank: "Coris Bank",
            amount: 3000000,
            outstanding: 2000000,
            risk: "high",
            status: "contentious",
          },
        ],
      },
      riskFactors: [
        { label: "DSR", value: 40, max: 100, weight: 30 },
        { label: "Garanties", value: 45, max: 100, weight: 25 },
        { label: "Historique", value: 0, max: 100, weight: 25 },
        { label: "Profil", value: 50, max: 100, weight: 20 },
      ],
      strengths: [],
      weaknesses: [
        "Impayé contentieux à la Centrale des Risques",
        "Garanties très insuffisantes",
        "Taux d'endettement élevé",
      ],
      recommendations: [
        "IMPÉRATIF: Régulariser l'impayé de 2 000 000 FCFA chez Coris Bank",
        "Fournir des garanties supplémentaires d'au moins 3 500 000 FCFA",
      ],
      blockingReasons: [
        "BLOCAGE AUTOMATIQUE: Impayé contentieux détecté à la Centrale des Risques chez Coris Bank pour un montant de 2 000 000 FCFA",
        "Score très insuffisant (52/100)",
        "Garanties ne couvrant que 56% du crédit demandé",
      ],
    },
    {
      id: 5,
      clientName: "Aminata Diallo",
      clientType: "physical",
      creditAmount: 2000000,
      duration: 12,
      periodicity: "monthly",
      purpose: "Stock marchandises",
      guaranteeValue: 2500000,
      monthlyIncome: 420000,
      monthlyExpenses: 150000,
      existingCredits: 0,
      score: 85,
      status: "pending",
      dateCreated: "2025-01-14",
      centraleRisques: {
        status: "clean",
        incidents: [],
      },
      riskFactors: [
        { label: "DSR", value: 85, max: 100, weight: 30 },
        { label: "Garanties", value: 95, max: 100, weight: 25 },
        { label: "Historique", value: 100, max: 100, weight: 25 },
        { label: "Profil", value: 80, max: 100, weight: 20 },
      ],
      strengths: [
        "Excellent taux d'endettement",
        "Garanties supérieures au crédit demandé",
        "Historique vierge",
        "Durée courte réduisant le risque",
      ],
      weaknesses: [],
      recommendations: [
        "Dossier favorable - En attente de validation finale",
      ],
      blockingReasons: [],
    },
  ]);

  const filteredDossiers = dossiers.filter((d) => {
    const matchesSearch =
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleDownloadPDF = (dossier: Dossier) => {
    generateAnalysisReportPDF(dossier);
    toast.success("Rapport PDF téléchargé");
  };

  const handleTransferN1 = (dossier: Dossier) => {
    toast.success(`Dossier de ${dossier.clientName} transféré au N+1`);
  };

  const renderSyntheticNote = (dossier: Dossier) => (
    <div className="space-y-6">
      {/* Score Gauge */}
      <div className="flex justify-center">
        <Gauge value={dossier.score} max={100} size={180} label="Score E3W" />
      </div>

      {/* Risk Radar */}
      <div className="flex justify-center">
        <RadarChart
          data={dossier.riskFactors.map((f) => ({
            label: f.label,
            value: f.value,
            max: f.max,
          }))}
          size={220}
        />
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Montant</p>
          <p className="font-semibold">
            {dossier.creditAmount.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Durée</p>
          <p className="font-semibold">{dossier.duration} mois</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Garanties</p>
          <p className="font-semibold">
            {dossier.guaranteeValue.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Couverture</p>
          <p className="font-semibold">
            {Math.round((dossier.guaranteeValue / dossier.creditAmount) * 100)}%
          </p>
        </div>
      </div>

      {/* Points forts */}
      {dossier.strengths.length > 0 && (
        <div>
          <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Points forts
          </h4>
          <ul className="space-y-1">
            {dossier.strengths.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points faibles */}
      {dossier.weaknesses.length > 0 && (
        <div>
          <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Points faibles
          </h4>
          <ul className="space-y-1">
            {dossier.weaknesses.map((w, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommandations */}
      <div>
        <h4 className="font-medium text-primary mb-2">Recommandations E3W</h4>
        <ul className="space-y-1">
          {dossier.recommendations.map((r, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Avis */}
      <div
        className={`p-4 rounded-lg ${
          dossier.status === "approved"
            ? "bg-green-50 border border-green-200"
            : dossier.status === "rejected"
            ? "bg-red-50 border border-red-200"
            : "bg-orange-50 border border-orange-200"
        }`}
      >
        <h4 className="font-medium mb-1">Avis E3W</h4>
        <p className="text-sm">
          {dossier.status === "approved"
            ? "FAVORABLE - Le dossier remplit les critères d'éligibilité et peut être transmis pour décaissement."
            : dossier.status === "rejected"
            ? "DÉFAVORABLE - Le dossier présente des risques significatifs qui empêchent son approbation."
            : "EN ANALYSE - Le dossier nécessite des vérifications complémentaires."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDownloadPDF(dossier)}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button
          className="flex-1"
          onClick={() => handleTransferN1(dossier)}
        >
          <Send className="h-4 w-4 mr-2" />
          Transférer N+1
        </Button>
      </div>

      {/* Voir plus */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setShowDetailedNote(true)}
      >
        Voir plus (Note détaillée)
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  const renderDetailedNote = (dossier: Dossier) => (
    <div className="space-y-6">
      {/* Titre */}
      <div className="text-center border-b pb-4">
        <h3 className="text-xl font-bold">Note d'Analyse Détaillée</h3>
        <p className="text-muted-foreground">
          Dossier de {dossier.clientName}
        </p>
      </div>

      {/* Score Gauge - Same as synthetic */}
      <div className="flex justify-center">
        <Gauge value={dossier.score} max={100} size={180} label="Score E3W" />
      </div>

      {/* Risk Radar - Same as synthetic */}
      <div className="flex justify-center">
        <RadarChart
          data={dossier.riskFactors.map((f) => ({
            label: f.label,
            value: f.value,
            max: f.max,
          }))}
          size={220}
        />
      </div>

      {/* Détail des scores */}
      <div>
        <h4 className="font-medium mb-3">Décomposition du Score</h4>
        <div className="space-y-3">
          {dossier.riskFactors.map((factor, i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{factor.label}</span>
                <span className="text-sm">
                  {factor.value}/{factor.max} (poids: {factor.weight}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    factor.value >= 75
                      ? "bg-green-500"
                      : factor.value >= 50
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${factor.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations détaillées crédit */}
      <div>
        <h4 className="font-medium mb-3">Détails du Crédit</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Montant demandé</p>
            <p className="font-semibold">
              {dossier.creditAmount.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Durée</p>
            <p className="font-semibold">{dossier.duration} mois</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Périodicité</p>
            <p className="font-semibold capitalize">{dossier.periodicity}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Objet</p>
            <p className="font-semibold">{dossier.purpose}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Revenus mensuels</p>
            <p className="font-semibold">
              {dossier.monthlyIncome.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Charges mensuelles</p>
            <p className="font-semibold">
              {dossier.monthlyExpenses.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Valeur garanties</p>
            <p className="font-semibold">
              {dossier.guaranteeValue.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Taux couverture</p>
            <p className="font-semibold">
              {Math.round((dossier.guaranteeValue / dossier.creditAmount) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Centrale des Risques */}
      <div>
        <h4 className="font-medium mb-3">Centrale des Risques</h4>
        {dossier.centraleRisques.status === "clean" ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Situation saine</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Aucun incident déclaré. Le client ne présente pas d'historique
              négatif auprès des établissements financiers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dossier.centraleRisques.incidents.map((incident, i) => (
              <div
                key={i}
                className={`border rounded-lg p-4 ${
                  incident.status === "contentious"
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      incident.status === "contentious"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  />
                  <span className="font-medium">{incident.bank}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      incident.status === "contentious"
                        ? "bg-red-200 text-red-800"
                        : incident.status === "active"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {incident.status === "contentious"
                      ? "Contentieux"
                      : incident.status === "active"
                      ? "Actif"
                      : "Régularisé"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Montant: </span>
                    <span className="font-medium">
                      {incident.amount.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Encours: </span>
                    <span className="font-medium">
                      {incident.outstanding.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risque: </span>
                    <span
                      className={`font-medium ${
                        incident.risk === "high"
                          ? "text-red-600"
                          : incident.risk === "medium"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {incident.risk === "high"
                        ? "Élevé"
                        : incident.risk === "medium"
                        ? "Moyen"
                        : "Faible"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Points forts */}
      {dossier.strengths.length > 0 && (
        <div>
          <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Points forts
          </h4>
          <ul className="space-y-1">
            {dossier.strengths.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points faibles */}
      {dossier.weaknesses.length > 0 && (
        <div>
          <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Points faibles
          </h4>
          <ul className="space-y-1">
            {dossier.weaknesses.map((w, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommandations */}
      <div>
        <h4 className="font-medium text-primary mb-2">Recommandations E3W</h4>
        <ul className="space-y-1">
          {dossier.recommendations.map((r, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Avis */}
      <div
        className={`p-4 rounded-lg ${
          dossier.status === "approved"
            ? "bg-green-50 border border-green-200"
            : dossier.status === "rejected"
            ? "bg-red-50 border border-red-200"
            : "bg-orange-50 border border-orange-200"
        }`}
      >
        <h4 className="font-medium mb-1">Avis E3W</h4>
        <p className="text-sm">
          {dossier.status === "approved"
            ? "FAVORABLE - Le dossier remplit les critères d'éligibilité et peut être transmis pour décaissement."
            : dossier.status === "rejected"
            ? "DÉFAVORABLE - Le dossier présente des risques significatifs qui empêchent son approbation."
            : "EN ANALYSE - Le dossier nécessite des vérifications complémentaires."}
        </p>
      </div>

      {/* Blocages (si applicable) */}
      {dossier.blockingReasons.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-700 mb-2">Raisons du blocage</h4>
          <ul className="space-y-2">
            {dossier.blockingReasons.map((reason, i) => (
              <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDownloadPDF(dossier)}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
        <Button className="flex-1" onClick={() => handleTransferN1(dossier)}>
          <Send className="h-4 w-4 mr-2" />
          Transférer N+1
        </Button>
      </div>

      {/* Retour à la note synthétique */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setShowDetailedNote(false)}
      >
        Retour à la note synthétique
      </Button>
    </div>
  );

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
              <FolderOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Mes Dossiers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou objet..."
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
              <SelectItem value="approved">Approuvés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total dossiers</p>
            <p className="text-2xl font-bold">{dossiers.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Approuvés</p>
            <p className="text-2xl font-bold text-green-600">
              {dossiers.filter((d) => d.status === "approved").length}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {dossiers.filter((d) => d.status === "pending").length}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Rejetés</p>
            <p className="text-2xl font-bold text-red-600">
              {dossiers.filter((d) => d.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Dossiers List */}
        <div className="space-y-4">
          {filteredDossiers.map((dossier) => (
            <div
              key={dossier.id}
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {dossier.clientType === "enterprise" ? (
                      <Briefcase className="h-7 w-7 text-primary" />
                    ) : (
                      <User className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">{dossier.clientName}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          dossier.status
                        )}`}
                      >
                        {getStatusIcon(dossier.status)}
                        {getStatusLabel(dossier.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1">{dossier.purpose}</p>

                    <div className="grid sm:grid-cols-4 gap-3 mt-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Montant: </span>
                        <span className="font-medium">
                          {dossier.creditAmount.toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Durée: </span>
                        <span className="font-medium">{dossier.duration} mois</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Score: </span>
                        <span
                          className={`font-bold ${
                            dossier.score >= 75
                              ? "text-green-600"
                              : dossier.score >= 50
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {dossier.score}/100
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Date: </span>
                        <span className="font-medium">
                          {new Date(dossier.dateCreated).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDossier(dossier);
                      setShowDetailedNote(false);
                    }}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Note d'analyse
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredDossiers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun dossier trouvé</p>
            </div>
          )}
        </div>
      </main>

      {/* Analysis Dialog */}
      <Dialog
        open={!!selectedDossier}
        onOpenChange={() => {
          setSelectedDossier(null);
          setShowDetailedNote(false);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              {showDetailedNote ? "Note Détaillée" : "Note Synthétique"} -{" "}
              {selectedDossier?.clientName}
            </DialogTitle>
          </DialogHeader>
          {selectedDossier && (
            showDetailedNote
              ? renderDetailedNote(selectedDossier)
              : renderSyntheticNote(selectedDossier)
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MesDossiers;