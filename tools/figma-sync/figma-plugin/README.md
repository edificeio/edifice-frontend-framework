# Edifice Token Extractor (plugin Figma)

Plugin Figma local qui sert de source d'entrée à `tools/figma-sync/` : il lit
les variables locales (primitives et sémantiques) du fichier Figma ouvert et
les exporte en JSON, en préservant les alias (référence vers une autre
variable) et la collection d'origine de chaque alias — indispensable, car
deux variables de collections différentes peuvent porter exactement le même
nom (ex. `danger/300` dans `primitives` et `primitivesLegacy`) avec des
valeurs différentes.

## Limite connue

Ce plugin est chargé en local (mode développement), pas publié sur la Figma
Community : il ne fonctionne **que dans l'app desktop Figma** (Mac/Windows),
jamais dans Figma ouvert depuis un navigateur — c'est une limite de Figma
lui-même (le mode développement de plugin n'existe pas côté navigateur),
pas un choix de ce projet.

## Installation (une fois, par personne)

1. Ouvrir l'app **desktop** Figma (pas le navigateur).
2. Menu Figma → **Plugins** → **Development** → **Import plugin from manifest…**
3. Sélectionner le fichier `manifest.json` de ce dossier.
4. Le plugin apparaît ensuite dans Plugins → Development → "Edifice Token
   Extractor", sur ce fichier Figma et sur les autres fichiers du même compte.

## Utilisation

1. Ouvrir le fichier Figma dont on veut exporter les variables :
   - primitives → **Edifice_UIKit**
   - sémantiques → **EdificeLibrary_Web**
2. Lancer le plugin (Plugins → Development → Edifice Token Extractor).
3. Cliquer **"Exporter les variables"**, attendre la fin de l'extraction.
4. Cliquer **"Copier"** (copie le JSON dans le presse-papier), puis coller le
   contenu là où c'est demandé — par exemple dans la skill Claude
   `figma-tokens-sync` (`.claude/skills/figma-tokens-sync/`), qui demande
   explicitement à coller d'abord l'export primitives, puis l'export
   sémantique.

## Fichiers

- `manifest.json` — déclaration du plugin (accès réseau désactivé
  volontairement : `networkAccess.allowedDomains: ["none"]`, le plugin ne
  fait que lire des variables locales et les afficher, jamais d'appel
  externe).
- `code.js` — logique d'extraction, tourne dans le sandbox du plugin Figma.
- `ui.html` — l'unique écran du plugin (bouton Exporter, zone de texte,
  bouton Copier).
