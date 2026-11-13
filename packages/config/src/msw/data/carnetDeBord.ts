export const mockPronoteXml = `<?xml version="1.0" encoding="UTF-8"?>
<Pronote>
  <Eleve>
    <Prenom>Alice</Prenom>
    <Nom>Lindo</Nom>
    <PageVieScolaire>
      <Retard page="vie-scolaire">
        <Date>2024-06-08T08:30:00</Date>
        <Justifie>false</Justifie>
        <Motif>Transport</Motif>
      </Retard>
      <Retard page="vie-scolaire">
        <Date>2024-06-03T08:15:00</Date>
        <Justifie>true</Justifie>
      </Retard>
      <Absence page="vie-scolaire">
        <DateDebut>2024-05-27T08:00:00</DateDebut>
        <DateFin>2024-05-27T12:00:00</DateFin>
        <EstOuverte>false</EstOuverte>
        <Justifie>false</Justifie>
        <Motif>Raison médicale</Motif>
      </Absence>
    </PageVieScolaire>
    <PageReleveDeNotes>
      <Devoir page="notes">
        <Note>16,00</Note>
        <Bareme>20</Bareme>
        <Matiere>TECHNOLOGIE</Matiere>
        <Date>2024-04-18</Date>
      </Devoir>
      <Devoir page="notes">
        <Note>12,50</Note>
        <Bareme>20</Bareme>
        <Matiere>FRANCAIS</Matiere>
        <Date>2024-04-15</Date>
      </Devoir>
    </PageReleveDeNotes>
    <PageCahierDeTextes>
      <CahierDeTextes>
        <Matiere>MATHEMATIQUES</Matiere>
        <TravailAFaire page="cdt">
          <PourLe>2024-06-12</PourLe>
          <Descriptif>&lt;p&gt;Exercices 4 et 5 page 112&lt;/p&gt;</Descriptif>
        </TravailAFaire>
      </CahierDeTextes>
      <CahierDeTextes>
        <Matiere>HISTOIRE-GEOGRAPHIE</Matiere>
        <TravailAFaire page="cdt">
          <PourLe>2024-06-14</PourLe>
          <Descriptif></Descriptif>
        </TravailAFaire>
      </CahierDeTextes>
    </PageCahierDeTextes>
    <PageCompetences>
      <Evaluation page="competences">
        <Intitule>Evaluation</Intitule>
        <Date>2024-06-13</Date>
        <Matiere>MATHEMATIQUES</Matiere>
        <Competence>Résoudre des problèmes</Competence>
        <Item>Calcul littéral</Item>
      </Evaluation>
    </PageCompetences>
  </Eleve>
  <Eleve>
    <Prenom>Marius</Prenom>
    <Nom>Lindo</Nom>
    <PageReleveDeNotes>
      <Devoir page="notes">
        <Note>14,00</Note>
        <Bareme>20</Bareme>
        <Matiere>ANGLAIS</Matiere>
        <Date>2024-05-02</Date>
      </Devoir>
    </PageReleveDeNotes>
  </Eleve>
  <Eleve>
    <Prenom>Inès</Prenom>
    <Nom>Lindo</Nom>
  </Eleve>
</Pronote>`;

export const mockPronoteStructures = [
  {
    structureId: 'structure-pronote',
    xmlResponse: mockPronoteXml,
    address: 'https://pronote.example.com/',
  },
];
