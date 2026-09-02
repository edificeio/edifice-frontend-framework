# ENABLING-1005 — entcore (portal, conversation, timeline, timeline-crna, auth)

Ce monorepo contient 5 projets Vite distincts, avec des situations très différentes — traités séparément.

## portal/frontend — dans le scope

`inlineDynamicImports: true` confirmé (`vite.config.ts:97-101`). Un seul point de lazy : la route racine (`routes/index.tsx:11`). Déploiement Vert.x standard (Jenkins copie `dist/*` en bloc). CI = Vitest uniquement, aucun e2e.

→ **ROAM** : Resolved/faible risque — surface minimale (1 route), bon candidat "app pilote" pour valider le pattern de propagation avant les apps à forte surface. **Charge QA : très faible (1 point)**.

## conversation/frontend — dans le scope, plus grosse surface entcore

`inlineDynamicImports: true` confirmé (`vite.config.ts:113-117`). 8 points de lazy dans un routing imbriqué (`routes/index.tsx`) : root, Folder (×2 chemins), Message (×2), create, print, oldformat. `playwright` est présent en **devDependency mais orphelin** (aucun spec, aucun job CI ne l'utilise).

→ **ROAM (Owned)** : dépendance Playwright orpheline détectée — opportunité (hors scope strict de ce ticket, mais à signaler) de l'activer pour ce module qui a justement la plus grosse surface de régression du lot entcore. **Charge QA : moyenne-élevée (8 points)**.

## timeline/frontend et timeline/frontend-crna — HORS SCOPE

Aucun `inlineDynamicImports` (confirmé par `git log -S"inlineDynamicImports"` : jamais présent). Build mono-entrée (`rollupOptions.input: { main: 'homepage.html' }` / `homepage-crna.html`) mais **pas mono-fichier** : le `dist/` committé de `timeline/frontend` contient déjà 2 fichiers JS distincts (`main-*.js` + `index-*.js` chargé dynamiquement via son propre `lazy()` en `routes/index.tsx:14`), preuve que ce module tourne **déjà en production avec plusieurs chunks**, sans aucune configuration additionnelle côté Vert.x.

→ **ROAM (Resolved)** : ces deux widgets sont hors scope de ENABLING-999 (rien à retirer) et servent de **preuve empirique** que les mods Vert.x d'entcore gèrent nativement le multi-chunk. **Charge QA : nulle** — aucune action, aucun re-test lié à ce ticket.

## auth/frontend — HORS SCOPE

Même situation que timeline : pas de `inlineDynamicImports`, build mono-entrée (`wayfv2.html`), lazy déjà actif (`routes/index.tsx:14`, route WAYF SAML) sans le flag.

→ **ROAM (Resolved)** : hors scope, aucune action. **Charge QA : nulle**.

## Recommandation pour la sous-tâche ENABLING-1005

Le titre de la sous-tâche ("entcore — propager le retrait de inlineDynamicImports") laisse penser à un scope uniforme sur tout le module ; en réalité **seuls portal et conversation** sont concernés. Préciser dans le ticket (ou son commentaire) que timeline (×2) et auth n'ont rien à modifier, pour éviter qu'un dev y cherche un flag qui n'existe pas.
