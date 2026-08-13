---
name: figma-tokens-sync
description: Synchronise les variables de design Figma (primitives + sémantiques) vers packages/bootstrap/src/themes/configs/ du repo edifice-frontend-framework. Demande à coller les deux exports JSON du plugin "Edifice Token Extractor", lance l'outil tools/figma-sync, et résume le rapport. À utiliser quand quelqu'un veut répercuter les derniers changements de variables Figma dans le repo.
---

# Figma → FrontendFramework : synchronisation des tokens

Ce skill fait tourner `tools/figma-sync` (outil TypeScript déjà présent dans le
repo `edifice-frontend-framework`) à partir de deux exports JSON — le plugin
Figma "Edifice Token Extractor" ne fonctionne que dans l'app desktop Figma et
ne peut pas être piloté automatiquement, donc l'export lui-même reste manuel
(la personne clique sur "Copier" dans le plugin).

Deux façons de récupérer cet export selon le contexte d'exécution :

- **Session locale avec accès Bash direct à la machine** (cas normal) :
  récupérer le presse-papier via `pbpaste` en shell, sans jamais faire
  transiter le JSON par le contexte du modèle — un export peut faire des
  milliers de lignes, et le lire/l'écrire via les outils Read/Write force le
  modèle à le régénérer en tokens de sortie, ce qui coûte plusieurs dizaines
  de milliers de tokens pour rien.
- **Session distante** (bridge `mcp__remote-devices__*`, pas d'accès Bash à
  la vraie machine de la personne, donc pas de vrai presse-papier local) :
  revenir à l'ancien comportement — demander de coller le JSON directement
  dans la conversation. `pbpaste` n'a alors aucun sens.

## Étapes, dans cet ordre

1. **Récupère le premier export (primitives, fichier Figma `Edifice_UIKit`)** :

   - **Cas local (Bash direct)** :
     - Demande : "Clique sur 'Copier' dans le plugin pour l'export
       primitives (fichier Edifice_UIKit), puis dis-moi quand c'est fait."
     - Attends la confirmation, puis exécute en Bash :
       `pbpaste > <fichier-temp-primitives.json>`.
     - Ne lis **jamais** ce fichier avec l'outil Read à ce stade — valide-le
       uniquement par commandes shell :
       - JSON valide :
         `node -e "JSON.parse(require('fs').readFileSync('<fichier>','utf8'))"`
       - Forme attendue (`data.primitives`, `data.primitivesLegacy`,
         `data.text` présents) :
         `node -e "const d=require('<fichier>'); if(!d.data.primitives||!d.data.primitivesLegacy||!d.data.text) process.exit(1)"`
     - Si une de ces commandes échoue (JSON invalide, mauvais export copié,
       presse-papier vide ou obsolète), dis-le clairement et redemande de
       cliquer sur "Copier" — ne devine jamais, ne complète jamais un export
       incomplet.
   - **Cas session distante (pas de vrai presse-papier)** :
     - Demande explicitement : "Colle-moi le JSON des primitives (export du
       plugin sur le fichier Figma Edifice_UIKit)."
     - Attends la réponse, vérifie la même forme attendue, et écris le
       contenu dans un fichier temporaire.

2. **Récupère le second export (sémantique, fichier Figma
   `EdificeLibrary_Web`)** — même logique que l'étape 1, adaptée selon le
   contexte :

   - **Cas local (Bash direct)** : demande de cliquer sur "Copier" pour cet
     export, `pbpaste > <fichier-temp-semantique.json>`, puis valide en shell
     (JSON valide + au moins une clé de mode présente parmi
     `one`/`neo`/`CRNA`/`edifice1d`/`edifice2d`, ex. via
     `node -e "const d=require('<fichier>'); const m=['one','neo','CRNA','edifice1d','edifice2d']; if(!m.some(k=>d.data[k])) process.exit(1)"`).
     Même exigence : ne jamais lire ce fichier avec Read, et redemander en
     cas d'échec de validation.
   - **Cas session distante** : demande de coller le JSON sémantique
     directement dans la conversation, vérifie la même forme attendue, écris
     dans un second fichier temporaire.

3. **Localise le repo**. Chemin habituel : `/Volumes/Work/edifice-frontend-framework`
   (via le bridge `mcp__remote-devices__*` si la session tourne dans le cloud ;
   chemin local direct si la session tourne déjà sur la machine de la
   personne). Vérifie que `tools/figma-sync/` existe à cet endroit avant de
   continuer. Si absent ou si le chemin ne correspond pas, dis-le plutôt que
   d'improviser un autre chemin.

4. **Lance le vrai script**, jamais une réimplémentation ou un raccourci :
   ```
   cd <repo-root>/tools/figma-sync
   pnpm install   # seulement si node_modules est absent
   pnpm sync -- --primitives <fichier-temp-primitives> --semantic <fichier-temp-semantique> \
     --repo-root <repo-root> --report <fichier-temp-report>.json
   ```
   Ne jamais passer `--skip-compile-check` ni `--skip-format` sur le vrai
   repo — ce sont des flags de test uniquement, documentés comme tels dans le
   README de l'outil.

5. **Lis le rapport produit** (`report.json`) et résume en prose, sans réciter
   le JSON brut :
   - Nombre de valeurs modifiées / ajoutées, par fichier.
   - Les `warnings` s'il y en a (usage suspect de la collection
     `primitivesLegacy` hors one/neo/color-app).
   - Les `guessedNames` (noms de variable devinés par kebab-case générique,
     `confidence: "guessed"`) — à relire en priorité. Si la liste est courte
     (< 10), énumère-les. Sinon donne le compte et propose d'afficher le
     détail si utile.
   - Les `unplaced` s'il y en a (tokens qu'aucune section existante ne peut
     accueillir automatiquement).
   - Si le script s'est arrêté avant d'écrire quoi que ce soit (échec de
     compilation Sass ou parenthèses déséquilibrées), dis-le immédiatement et
     montre l'erreur — ne cherche pas à corriger le SCSS généré toi-même sans
     demander confirmation d'abord.

6. **Ne commit jamais automatiquement.** Rappelle de relire le `git diff` sur
   `packages/bootstrap/src/themes/configs/` avant de committer. S'il n'y a pas
   de branche dédiée déjà en cours, propose d'en créer une, mais ne le fais
   pas sans confirmation explicite.

7. **Nettoie les fichiers temporaires** (les deux JSON collés et le rapport)
   une fois le résumé donné, sauf demande explicite de les garder.

## Garde-fous — à ne jamais franchir

- Ne jamais écrire en dehors de `packages/bootstrap/src/themes/` (le script
  respecte déjà ce périmètre — ne l'étends pas côté skill).
- Ne jamais ajouter ou modifier une ligne `@use`/`@forward` en tête d'un
  fichier de thème : ce n'est pas le rôle du script (voir le README de
  `tools/figma-sync`). Si un token nécessite un import manquant, le signaler
  plutôt que de l'ajouter soi-même.
- Ne jamais committer, pousser, ou créer de PR sans demande explicite.
- Ne jamais inventer ou compléter le contenu d'un export si la personne ne
  l'a pas (encore) collé, même partiellement.
