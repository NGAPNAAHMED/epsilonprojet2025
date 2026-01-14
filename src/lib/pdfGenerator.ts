// PDF Generator utility
export const generatePDF = (content: string, filename: string) => {
  // Create PDF-like content with proper formatting
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length ${content.length + 100}
>>
stream
BT
/F1 12 Tf
50 750 Td
${content.split('\n').map((line, i) => `(${line.replace(/[()\\]/g, '\\$&')}) Tj 0 -14 Td`).join('\n')}
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000${400 + content.length} 00000 n

trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${500 + content.length}
%%EOF`;

  // Create blob and download
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate analysis report PDF
export const generateAnalysisReportPDF = (dossier: any) => {
  const content = `
RAPPORT D'ANALYSE E3W
=====================

Dossier: ${dossier.clientName}
Date: ${new Date().toLocaleDateString('fr-FR')}

SCORE GLOBAL: ${dossier.score}/100

DETAILS DU CREDIT
-----------------
Montant demande: ${dossier.creditAmount?.toLocaleString('fr-FR')} FCFA
Duree: ${dossier.duration} mois
Periodicite: ${dossier.periodicity}
Objet: ${dossier.purpose}

ANALYSE DES RISQUES
-------------------
${dossier.riskAnalysis || 'Analyse en cours...'}

CENTRALE DES RISQUES
--------------------
${dossier.centraleRisques?.status === 'clean' 
  ? 'Aucun incident declare. Situation saine.'
  : `ATTENTION: Incidents detectes dans ${dossier.centraleRisques?.incidents?.length || 0} etablissement(s)`
}

POINTS FORTS
------------
${dossier.strengths?.map((s: string) => `- ${s}`).join('\n') || '- Dossier complet'}

RECOMMANDATIONS
---------------
${dossier.recommendations?.map((r: string) => `- ${r}`).join('\n') || '- Aucune recommandation particuliere'}

AVIS
----
${dossier.decision === 'approved' 
  ? 'FAVORABLE - Dossier valide pour traitement'
  : dossier.decision === 'rejected'
  ? 'DEFAVORABLE - Dossier bloque'
  : 'EN ATTENTE - Analyse complementaire requise'
}

---
Genere par E3W - Systeme d'Analyse de Credit
`;

  generatePDF(content, `Rapport_Analyse_${dossier.clientName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Format number with thousand separators
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

// Format date as dd/mm/yyyy
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};