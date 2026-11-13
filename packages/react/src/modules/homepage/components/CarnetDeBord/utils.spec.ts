import { mockPronoteStructures } from '@edifice.io/config';
import { computeContentTypes, getItemCount, parseEleves } from './utils';

describe('parseEleves', () => {
  it('creates one eleve per Pronote "Eleve" and matches the user children', () => {
    const eleves = parseEleves(mockPronoteStructures, {
      'alice-id': { firstName: 'ALICE', lastName: 'lindo' },
    });

    expect(eleves.map((eleve) => eleve.name)).toEqual([
      'Alice',
      'Marius',
      'Inès',
    ]);
    expect(eleves[0].avatar).toBe(
      '/userbook/avatar/alice-id?thumbnail=100x100',
    );
    expect(eleves[1].avatar).toBe('');
    expect(eleves[0].address).toBe('https://pronote.example.com/');
  });
});

describe('computeContentTypes', () => {
  const [alice, marius, ines] = parseEleves(mockPronoteStructures, {});

  it('returns empty content types without eleve', () => {
    const contentTypes = computeContentTypes(null);
    expect(contentTypes.map((ct) => ct.title)).toEqual([
      'retards-absences',
      'grades',
      'diary',
      'skills',
    ]);
    expect(contentTypes.every((ct) => ct.compact === false)).toBe(true);
  });

  it('keeps unjustified latenesses and absences, most recent first', () => {
    const [absences] = computeContentTypes(alice);

    expect(absences.compact).toBe('le 08/06/2024 - 08:30');
    expect(absences.full).toEqual([
      expect.objectContaining({
        kind: 'lateness',
        value: 'le 08/06/2024 - 08:30',
        motif: 'Transport',
      }),
      expect.objectContaining({
        kind: 'absence',
        value: 'du 27/05/2024 - 08:00 au 27/05/2024 - 12:00',
        motif: 'Raison médicale',
      }),
    ]);
  });

  it('builds the grades, diary and skills summaries', () => {
    const [, grades, diary, skills] = computeContentTypes(alice);

    expect(grades.compact).toBe('16,00/20 en TECHNOLOGIE le 18/04/2024');
    expect(diary.compact).toBe(
      'Nouveau devoir MATHEMATIQUES pour le 12/06/2024',
    );
    expect(Array.isArray(diary.full) && diary.full[0].subsections?.[0]).toEqual(
      expect.objectContaining({ content: 'Exercices 4 et 5 page 112' }),
    );
    expect(skills.compact).toBe('Evaluation le 13/06/2024 en MATHEMATIQUES');
    expect(Array.isArray(skills.full) && skills.full[0].subsections).toEqual([
      { header: 'Compétence', content: 'Résoudre des problèmes' },
      { header: 'Item', content: 'Calcul littéral' },
    ]);
  });

  it('counts the entries of each content type', () => {
    expect(computeContentTypes(alice).map(getItemCount)).toEqual([2, 2, 2, 1]);
    expect(computeContentTypes(marius).map(getItemCount)).toEqual([0, 1, 0, 0]);
    expect(computeContentTypes(ines).map(getItemCount)).toEqual([0, 0, 0, 0]);
  });
});
