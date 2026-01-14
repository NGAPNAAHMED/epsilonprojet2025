// Credit scoring utilities

export interface Dossier {
  id: number;
  clientName: string;
  clientType: 'physical' | 'enterprise';
  creditAmount: number;
  duration: number;
  periodicity: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  purpose: string;
  guaranteeValue: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingCredits: number;
  score: number;
  status: 'pending' | 'approved' | 'rejected' | 'simulation';
  dateCreated: string;
  
  // Centrale des risques
  centraleRisques: {
    status: 'clean' | 'incidents';
    incidents: {
      bank: string;
      amount: number;
      outstanding: number;
      risk: 'low' | 'medium' | 'high';
      status: 'active' | 'regularized' | 'contentious';
    }[];
  };
  
  // Analysis details
  riskFactors: {
    label: string;
    value: number;
    max: number;
    weight: number;
  }[];
  
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  blockingReasons: string[];
}

// Calculate DSR (Debt Service Ratio)
export const calculateDSR = (monthlyIncome: number, monthlyExpenses: number, monthlyPayment: number): number => {
  if (monthlyIncome === 0) return 100;
  return ((monthlyExpenses + monthlyPayment) / monthlyIncome) * 100;
};

// Calculate monthly payment
export const calculateMonthlyPayment = (
  amount: number,
  duration: number,
  interestRate: number = 12, // Annual rate %
  periodicity: string = 'monthly'
): number => {
  const periods = periodicity === 'monthly' ? duration 
    : periodicity === 'quarterly' ? Math.ceil(duration / 3)
    : periodicity === 'biannual' ? Math.ceil(duration / 6)
    : Math.ceil(duration / 12);
  
  const periodicRate = (interestRate / 100) / (12 / (duration / periods));
  
  if (periodicRate === 0) return amount / periods;
  
  const payment = amount * (periodicRate * Math.pow(1 + periodicRate, periods)) / 
    (Math.pow(1 + periodicRate, periods) - 1);
  
  return payment;
};

// Calculate guarantee coverage ratio
export const calculateGuaranteeCoverage = (guaranteeValue: number, creditAmount: number): number => {
  if (creditAmount === 0) return 100;
  return (guaranteeValue / creditAmount) * 100;
};

// Comprehensive score calculation
export const calculateScore = (dossier: Partial<Dossier>): { score: number; details: any } => {
  let score = 0;
  const details: any = {
    dsr: { value: 0, score: 0, weight: 30 },
    guarantee: { value: 0, score: 0, weight: 25 },
    centraleRisques: { value: 0, score: 0, weight: 25 },
    profile: { value: 0, score: 0, weight: 20 },
  };
  
  // 1. DSR Score (30%)
  const monthlyPayment = calculateMonthlyPayment(
    dossier.creditAmount || 0,
    dossier.duration || 12,
    12,
    dossier.periodicity || 'monthly'
  );
  const dsr = calculateDSR(
    dossier.monthlyIncome || 0,
    dossier.monthlyExpenses || 0,
    monthlyPayment
  );
  details.dsr.value = dsr;
  
  if (dsr <= 30) details.dsr.score = 100;
  else if (dsr <= 40) details.dsr.score = 80;
  else if (dsr <= 50) details.dsr.score = 60;
  else if (dsr <= 60) details.dsr.score = 40;
  else if (dsr <= 70) details.dsr.score = 20;
  else details.dsr.score = 0;
  
  // 2. Guarantee Coverage Score (25%)
  const coverage = calculateGuaranteeCoverage(
    dossier.guaranteeValue || 0,
    dossier.creditAmount || 0
  );
  details.guarantee.value = coverage;
  
  if (coverage >= 150) details.guarantee.score = 100;
  else if (coverage >= 120) details.guarantee.score = 85;
  else if (coverage >= 100) details.guarantee.score = 70;
  else if (coverage >= 80) details.guarantee.score = 50;
  else if (coverage >= 60) details.guarantee.score = 30;
  else details.guarantee.score = 10;
  
  // 3. Centrale des Risques Score (25%)
  const incidents = dossier.centraleRisques?.incidents || [];
  const hasContentious = incidents.some(i => i.status === 'contentious');
  const hasActive = incidents.some(i => i.status === 'active' && i.risk === 'high');
  
  if (incidents.length === 0) {
    details.centraleRisques.score = 100;
  } else if (hasContentious) {
    details.centraleRisques.score = 0; // Auto-block
  } else if (hasActive) {
    details.centraleRisques.score = 20;
  } else {
    details.centraleRisques.score = 60;
  }
  details.centraleRisques.value = incidents.length;
  
  // 4. Profile Score (20%)
  let profileScore = 50;
  const income = dossier.monthlyIncome || 0;
  const amount = dossier.creditAmount || 0;
  
  // Income to loan ratio
  if (income * 12 >= amount * 2) profileScore += 25;
  else if (income * 12 >= amount) profileScore += 10;
  else profileScore -= 20;
  
  // Duration reasonableness
  const duration = dossier.duration || 12;
  if (duration <= 24) profileScore += 15;
  else if (duration <= 48) profileScore += 5;
  else profileScore -= 10;
  
  details.profile.score = Math.min(100, Math.max(0, profileScore));
  details.profile.value = profileScore;
  
  // Calculate weighted score
  score = (
    (details.dsr.score * details.dsr.weight) +
    (details.guarantee.score * details.guarantee.weight) +
    (details.centraleRisques.score * details.centraleRisques.weight) +
    (details.profile.score * details.profile.weight)
  ) / 100;
  
  return { score: Math.round(score), details };
};

// Check if dossier should be blocked
export const checkBlocking = (dossier: Partial<Dossier>): { blocked: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  const { score, details } = calculateScore(dossier);
  
  // Score < 75 = blocked
  if (score < 75) {
    reasons.push(`Le score global de ${score}/100 est inférieur au seuil minimum de 75/100 requis pour l'approbation.`);
  }
  
  // Check centrale des risques - auto block if contentious
  const incidents = dossier.centraleRisques?.incidents || [];
  const hasContentious = incidents.some(i => i.status === 'contentious');
  
  if (hasContentious) {
    const contentiousIncident = incidents.find(i => i.status === 'contentious')!;
    reasons.push(
      `ALERTE CENTRALE DES RISQUES: ${dossier.clientName} présente un impayé contentieux auprès de ${contentiousIncident.bank} ` +
      `pour un montant de ${contentiousIncident.amount.toLocaleString('fr-FR')} FCFA avec un encours de ` +
      `${contentiousIncident.outstanding.toLocaleString('fr-FR')} FCFA. Le client doit régulariser cette situation avant toute nouvelle demande de crédit.`
    );
  }
  
  // Check for active high-risk incidents
  const activeHighRisk = incidents.filter(i => i.status === 'active' && i.risk === 'high');
  if (activeHighRisk.length > 0) {
    activeHighRisk.forEach(incident => {
      reasons.push(
        `ATTENTION: Crédit à risque élevé détecté chez ${incident.bank} - Encours: ${incident.outstanding.toLocaleString('fr-FR')} FCFA. ` +
        `Ce crédit actif impacte significativement la capacité d'endettement du client.`
      );
    });
  }
  
  // DSR too high
  if (details.dsr.value > 50) {
    reasons.push(
      `Le taux d'endettement (DSR) de ${details.dsr.value.toFixed(1)}% dépasse le seuil acceptable de 50%. ` +
      `Les charges mensuelles de ${(dossier.monthlyExpenses || 0).toLocaleString('fr-FR')} FCFA ajoutées aux ` +
      `remboursements prévus représentent une part trop importante des revenus de ` +
      `${(dossier.monthlyIncome || 0).toLocaleString('fr-FR')} FCFA.`
    );
  }
  
  // Insufficient guarantee
  if (details.guarantee.value < 80) {
    reasons.push(
      `La couverture par les garanties est insuffisante: ${details.guarantee.value.toFixed(1)}% du montant demandé. ` +
      `Les garanties proposées d'une valeur de ${(dossier.guaranteeValue || 0).toLocaleString('fr-FR')} FCFA ` +
      `ne couvrent pas suffisamment le crédit de ${(dossier.creditAmount || 0).toLocaleString('fr-FR')} FCFA. ` +
      `Une couverture minimale de 100% est recommandée.`
    );
  }
  
  return {
    blocked: reasons.length > 0,
    reasons
  };
};

// Generate recommendations
export const generateRecommendations = (dossier: Partial<Dossier>): string[] => {
  const recommendations: string[] = [];
  const { details } = calculateScore(dossier);
  
  // Guarantee recommendations
  if (details.guarantee.value < 100) {
    const neededGuarantee = (dossier.creditAmount || 0) - (dossier.guaranteeValue || 0);
    recommendations.push(
      `Fournir une garantie supplémentaire d'une valeur minimale de ${neededGuarantee.toLocaleString('fr-FR')} FCFA ` +
      `pour atteindre une couverture de 100%. Cela améliorerait le score de garantie de ${details.guarantee.score}/100 à environ 70/100.`
    );
  }
  
  // DSR recommendations
  if (details.dsr.value > 40) {
    const maxPayment = (dossier.monthlyIncome || 0) * 0.4 - (dossier.monthlyExpenses || 0);
    const suggestedDuration = Math.ceil((dossier.creditAmount || 0) / maxPayment);
    
    if (suggestedDuration > (dossier.duration || 12)) {
      recommendations.push(
        `Allonger la durée du crédit à ${suggestedDuration} mois permettrait de réduire la mensualité et ` +
        `ramener le taux d'endettement sous le seuil de 40%.`
      );
    }
    
    const maxAmount = maxPayment * (dossier.duration || 12) * 0.8;
    if (maxAmount < (dossier.creditAmount || 0)) {
      recommendations.push(
        `Réduire le montant du crédit à ${maxAmount.toLocaleString('fr-FR')} FCFA maximum pour maintenir ` +
        `un taux d'endettement acceptable avec la durée actuelle.`
      );
    }
  }
  
  // Centrale des risques recommendations
  const incidents = dossier.centraleRisques?.incidents || [];
  if (incidents.some(i => i.status === 'active')) {
    recommendations.push(
      `Régulariser les crédits en cours auprès des autres établissements financiers avant de soumettre une nouvelle demande. ` +
      `Présenter les preuves de remboursement ou de régularisation.`
    );
  }
  
  // General recommendations
  if ((dossier.monthlyIncome || 0) < (dossier.creditAmount || 0) / 12) {
    recommendations.push(
      `Envisager un apport personnel pour réduire le montant à financer et améliorer le profil de risque.`
    );
  }
  
  return recommendations;
};

// Generate strengths
export const generateStrengths = (dossier: Partial<Dossier>): string[] => {
  const strengths: string[] = [];
  const { details } = calculateScore(dossier);
  
  if (details.dsr.value <= 30) {
    strengths.push('Excellent taux d\'endettement permettant une bonne marge de sécurité');
  }
  
  if (details.guarantee.value >= 120) {
    strengths.push('Garanties solides couvrant largement le montant du crédit');
  }
  
  if (details.centraleRisques.score === 100) {
    strengths.push('Historique de crédit irréprochable - Aucun incident à la Centrale des Risques');
  }
  
  const income = dossier.monthlyIncome || 0;
  const amount = dossier.creditAmount || 0;
  if (income * 12 >= amount * 2) {
    strengths.push('Revenus stables et suffisants par rapport au montant demandé');
  }
  
  if ((dossier.duration || 12) <= 24) {
    strengths.push('Durée de crédit courte réduisant le risque global');
  }
  
  return strengths;
};

// Generate amortization table
export const generateAmortizationTable = (
  amount: number,
  duration: number,
  interestRate: number = 12,
  startDate: Date = new Date()
): { month: number; date: string; principal: number; interest: number; payment: number; balance: number }[] => {
  const table: any[] = [];
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
    (Math.pow(1 + monthlyRate, duration) - 1);
  
  let balance = amount;
  
  for (let month = 1; month <= duration; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance = Math.max(0, balance - principal);
    
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);
    
    table.push({
      month,
      date: paymentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      principal: Math.round(principal),
      interest: Math.round(interest),
      payment: Math.round(monthlyPayment),
      balance: Math.round(balance),
    });
  }
  
  return table;
};