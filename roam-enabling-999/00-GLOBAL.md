# ROAM — ENABLING-999 : retrait de `inlineDynamicImports` (boilerplate + 12 apps)

**Ticket** : [ENABLING-999](https://edifice-community.atlassian.net/browse/ENABLING-999) — *"Retirer inlineDynamicImports du boilerplate et propager aux apps"*
**Périmètre analysé** : la Story (fix racine `edifice-react-boilerplate`) + ses 12 sous-tâches de propagation (ENABLING-1001 → 1012), complété par une vérification de couverture sur l'ensemble des dépôts sibling (`../`) pour détecter d'éventuelles apps oubliées.
**Nature du document** : analyse ROAM (Risques / Owned / Accepted / Mitigated) et estimation de la charge QA. **Aucune implémentation n'a été faite** — investigation en lecture seule sur les dépôts sibling (`../`).

## 0. Vérification de couverture — une app manque au ticket

Un balayage de tous les `vite.config.ts` sous `../` (hors dépôts de tooling/PoC `POC/` et `claude-homeworks/`, exclus sur demande) a été fait pour vérifier qu'aucune app cliente du boilerplate n'a été oubliée par le découpage en 12 sous-tâches.

- **`evaluation-one-web`** — a bien `inlineDynamicImports: true` et `base: '/communities'`, mais il s'agit d'un dépôt distinct (`edificeio/evaluation-one-web`) figé à un unique commit ("initial commit", 2025-12-02), clairement un fork/prototype abandonné et supplanté par le dépôt `communities` actuellement actif (ENABLING-1004). **Écarté, aucune action.**
- **`explorer`** (`ode-explorer`) — a `inlineDynamicImports: true` dans son build "app", mais **vérifié et confirmé sans usage en production** : le script `build` (`vite build && vite build --mode lib`) construit bien les deux, mais seul le `frontend/Jenkinsfile` (`build.sh publishNPM`) est exécuté en CI, qui ne publie que le build **lib** sur npm ; aucune trace dans tout le repo (`backend/build.sh`, Jenkinsfiles) d'une copie du `dist/` (build "app") vers le backend ou un quelconque service de fichiers statiques. Le build "app" ne sert donc qu'au `vite preview` local. **Écarté, aucune action** — mais à noter : explorer est massivement consommé comme librairie (`ode-explorer`) par la plupart des 12 apps déjà couvertes (racine de route chez homeworks, rack, blog, wiki, mindmap, collaborative-wall, communities), donc un futur changement sur son build **lib** (qui lui n'a pas le flag) mériterait sa propre vigilance, indépendamment de ce ticket.
- **[`livret-scolaire-front-web`](13-livret-scolaire-front-web.md)** — app active et récente (équipe récemment internalisée), confirmée par l'utilisateur comme à inclure. **Genuine oubli du ticket, aucune sous-tâche ENABLING-999 ne la couvre.** Voir chapitre dédié. À noter également : `appointments`, `homework-assistance` et `magneto` utilisent déjà `manualChunks` sans `inlineDynamicImports` — même situation que `form` (ENABLING-1006), donc naturellement hors scope, pas des oublis.

---

## 1. Contexte technique (rappel)

`edifice-react-boilerplate/frontend/vite.config.ts` force `rollupOptions.output.inlineDynamicImports: true`, ce qui aplatit tous les `lazy()` React/react-router en un seul fichier JS. Les apps clonées du boilerplate héritent de ce réglage et ne bénéficient donc pas du code-splitting que permettrait `@edifice.io/react`. Le ticket propose de retirer ce flag du boilerplate puis de le propager à chaque app cliente (une sous-tâche par app).

Le ticket lui-même liste un **pré-requis bloquant** ("vérifier qu'aucune contrainte de déploiement n'impose un fichier JS unique") et qualifie le risque recette de **modéré**.

## 2. Verdict sur le pré-requis bloquant — RÉSOLU

L'investigation sur les 13 dépôts (12 apps + boilerplate) ne trouve **aucune** contrainte technique qui imposerait un fichier JS unique :

- Aucune CSP hardcodée, aucun Subresource Integrity (`integrity=`), aucun service worker / manifeste de precache dans aucun des 13 repos.
- Les contrôleurs Vert.x (`renderView(...)`) et les modules NestJS (`ServeStaticModule.forRoot(...)`, communities/collect) servent le contenu de `dist/` de façon générique, sans whitelist de fichiers.
- Les pipelines CI (Jenkins ou GitHub Actions) copient systématiquement le dossier `dist/*` en bloc (`cp -R ../frontend/dist/* ./src/main/resources/`), jamais un nom de fichier figé.
- **Preuve empirique directe** : `entcore/timeline`, `entcore/timeline/frontend-crna` et `entcore/auth` n'ont *jamais* eu `inlineDynamicImports` et tournent déjà en production avec plusieurs chunks JS (constaté dans leurs `dist/` committés) sans aucune adaptation backend. C'est le meilleur argument de dérisquage disponible pour rassurer les autres sous-tâches.

→ Le "risque modéré" du ticket peut être requalifié à la baisse côté **infrastructure/déploiement**. Le risque restant est presque exclusivement **fonctionnel/UX** (routes et modales qui se chargent mal après coupure en chunks) et **QA** (absence de filet de test automatisé, détaillé ci-dessous).

## 3. Cartographie des 12 sous-tâches

| Sous-tâche | App | `inlineDynamicImports` confirmé ? | Points de lazy loading | Dans le scope réel ? |
|---|---|---|---|---|
| ENABLING-1001 | actualites | ✅ | ~10 (2 modales + 8 routes) | Oui |
| ENABLING-1002 | blog | ✅ | ~20 (13 routes + 7 modales, dont portail **public**) | Oui |
| ENABLING-1003 | collaborative-wall | ✅ | 8 (5 routes + 3 modales) | Oui |
| ENABLING-1004 | communities | ✅ | ~9 (4 routes + 6 modales) — **gain limité**, modules lourds restent eager | Oui, portée réduite |
| ENABLING-1005 | entcore | portal ✅ / conversation ✅ / timeline, timeline-crna, auth ❌ | portal 1, conversation 8, timeline/auth 0 (déjà splittés sans le flag) | Partiel : timeline(×2) et auth **hors scope** |
| ENABLING-1006 | form (formulaire + formulaire-public) | ❌ (jamais eu le flag, `manualChunks` depuis l'origine) | déjà actif nativement | **Non — sous-tâche potentiellement sans objet** |
| ENABLING-1007 | homeworks | ✅ | 3 (root/explorer/notebook) | Oui, faible surface |
| ENABLING-1008 | mindmap | ✅ | 3 (root/mindmap/print), embarque l'éditeur wisemapping | Oui |
| ENABLING-1009 | rack | ✅ | 8, concentrés sur le module `@edifice.io/collect-frontend` (antd, react-pdf, pdfjs-dist) | Oui, couplé à ENABLING-1012 |
| ENABLING-1010 | support | ✅ | 4 (root + 3 routes) | Oui, faible surface |
| ENABLING-1011 | wiki | ✅ | ~10 (2 routes + 8 modales) | Oui |
| ENABLING-1012 | collect | ✅ build "app" (dans le scope) + build "lib" (hors scope initial du ticket, justification de son flag **invalidée par test**, cf. chapitre) | 9 routes | Oui, avec décision à prendre sur le 2ᵉ build |

Détail complet par app : voir les chapitres `01-…` à `12-…`.

## 4. Analyse ROAM

### R — Resolved (risques levés par l'investigation)
1. **Contrainte de déploiement "fichier JS unique"** (pré-requis bloquant du ticket) : aucune trouvée, preuve empirique via entcore/timeline et entcore/auth déjà en multi-chunk en prod. *Aucune action requise.*
2. **Cohérence `base` / `assetsDir`** : vérifiée cohérente (`base: '/<app>'`, `assetsDir: 'public'`) sur les 12 apps — pas de risque de 404 sur les chunks lié à un mauvais chemin.
3. **Packaging CI/Jenkins** : copie intégrale de `dist/*`, aucune whitelist de fichier — un nombre de chunks variable ne casse aucun pipeline.

### O — Owned (nécessite une décision/action d'un owner avant de lancer le fix)
1. **form (ENABLING-1006) semble sans objet** — jamais eu `inlineDynamicImports`, utilise déjà `manualChunks` depuis la création du projet (`git log -S"inlineDynamicImports"` ne remonte aucun commit form). *Owner : reporter/PO du ticket* — à trancher : fermer la sous-tâche sans action, ou la requalifier (ex. harmoniser `manualChunks` avec le reste du parc).
2. **collect a deux builds** (`vite build` app + `vite build --mode lib` pour l'embedding dans `rack`). Le build "lib" porte un commentaire justifiant `inlineDynamicImports: true` pour fonctionner en import dynamique dans rack — **commentaire vérifié et invalidé par un test empirique** (build réel sans le flag, re-bundlé dans un consommateur simulant fidèlement rack : Rollup retrace et re-chunk correctement les routes lazy internes, zéro fichier manquant ; le ticket PEDAGO-4081 cité par le commit qui a introduit ce flag décrit un bug de lien de notification, sans rapport avec du chargement de chunk). *Owner : reporter/PO du ticket* — décider si le flag du build "lib" doit être retiré aussi (probable absence de contrainte réelle) ou conservé par prudence ; si retrait, prévoir un test croisé avec rack avant mise en prod.
3. **Couplage rack ↔ collect** — `rack` charge `@edifice.io/collect-frontend/lib` (qui embarque antd + react-pdf + pdfjs-dist) via `lazy()`/import dynamique à 3 endroits. Un changement de découpage sur `rack` peut interagir avec le comportement du module Collect. *Owner : coordination entre les devs assignés à ENABLING-1009 et ENABLING-1012* — tester les deux en recette avant validation finale.
4. **communities — gain de perf potentiellement décevant** : les modules les plus lourds (éditeur wiki, `collect-frontend` dans les annonces, wizard de création) sont importés de façon *eager*, pas `lazy()`. Retirer le flag ne produira que ~9 petits chunks (modales + routes), pas la réduction de bundle attendue. *Owner : dev assigné à ENABLING-1004* — documenter dans la PR que le gain est partiel, éviter une fausse impression d'échec du fix en recette/mesure.
5. **mindmap — plugin custom `vite-plugin-edifice.ts`** manipule `transformIndexHtml` (hash sur le CSS bootstrap) : à revérifier qu'il continue de fonctionner correctement une fois plusieurs balises `<script>` générées dans `index.html`.

### A — Accepted (risques résiduels, aucune action bloquante avant propagation)
1. **Absence quasi totale de tests e2e/Playwright** sur les 13 dépôts (`conversation` a `playwright` en devDependency mais aucun spec/job CI ne l'utilise — dépendance orpheline). Accepté dans le cadre du calendrier "rodage estival" du ticket, mais implique une charge de QA manuelle significative (§5).
2. **`chunkSizeWarningLimit` sur-élevé** (4000–5000 vs 500 par défaut Vite) dans toutes les apps concernées : cosmétique, n'entraîne aucun risque fonctionnel, juste un warning Vite qui perdra sa pertinence tant qu'il ne sera pas réajusté après le fix.
3. **Zéro test unitaire** dans plusieurs apps malgré Vitest configuré (blog, collaborative-wall, mindmap, rack, collect, communities) : préexistant, hors scope de ce ticket, mais réduit d'autant le filet de sécurité disponible pour ces apps spécifiquement.
4. **Anti-pattern `React.lazy()` recréé à chaque render** dans `communities/HomeTab.tsx:28` et **doublon de route "print"** (HTML statique backend vs route React) dans `collaborative-wall` : bugs/legacy préexistants sans lien avec ce ticket — à traiter séparément.

### M — Mitigated (plan d'action recommandé)
1. **Filet de test manquant → smoke-test manuel structuré et priorisé.** Charge estimée au §5, en commençant par les apps à faible surface (support: 4 points, homeworks: 3, entcore/portal: 1) pour valider le pattern avant les apps à forte surface (blog: ~20, wiki: ~10, actualites: ~10).
2. **Séquencement de la propagation** : déployer/valider le boilerplate + 1-2 apps pilotes à faible risque avant de propager aux 10 autres, plutôt qu'un big-bang sur les 12 sous-tâches en parallèle.
3. **Réajuster `chunkSizeWarningLimit`** dans chaque PR de propagation (nettoyage mineur, à ne pas oublier une fois le vrai découpage en place).
4. **Isoler explicitement le build "lib" de collect** dans la PR ENABLING-1012 (ne toucher que le bloc `else` / build "app" de `vite.config.ts`) et prévoir un test croisé rack + collect avant mise en prod des deux.

## 5. Charge QA estimée

Aucun test automatisé (e2e) ne couvre le comportement de chargement des chunks sur aucune des 12 apps. La QA repose donc entièrement sur un smoke-test manuel en recette, par app, après propagation du fix : vérifier pour chaque route/modale listée qu'elle se charge sans 404, que le routing reste correct, et comparer la taille du bundle avant/après (comme demandé dans le ticket).

| App | Points à re-tester manuellement | Charge relative | Spécificité à surveiller |
|---|---|---|---|
| blog | ~20 (13 routes + 7 modales) | **Élevée** | Portail **public non authentifié** — surface sensible |
| wiki | ~10 (2 routes + 8 modales) | Élevée | Modales de gestion de page (suppression, historique, visibilité) |
| actualites | ~10 (2 modales + 8 routes) | Élevée | Pas de `manualChunks` → découpage par défaut Rollup, à observer |
| collect | 9 routes | Moyenne-élevée | Ne pas casser le build "lib" embarqué dans rack |
| communities | ~9 (4 routes + 6 modales) | Moyenne | Gain de perf limité — bien vérifier que rien ne casse malgré le peu de gain |
| conversation (entcore) | 8 (routing imbriqué) | Moyenne-élevée | Plus grosse surface de lazy loading du lot |
| collaborative-wall | 8 (5 routes + 3 modales) | Moyenne | Vérifier le modal websocket (temps réel) + doublon route print |
| rack | 8, concentrés sur 1 module lourd | Moyenne (mais **impact élevé** si ça casse) | Module Collect embarqué (antd, react-pdf, pdfjs-dist) |
| mindmap | 3 (root/mindmap/print) | Faible-moyenne | Éditeur wisemapping potentiellement lourd en chunk séparé |
| support | 4 (root + 3 routes) | Faible | Bon candidat "app pilote" |
| homeworks | 3 (root/explorer/notebook) | Faible | Bon candidat "app pilote" |
| entcore/portal | 1 route | Très faible | Bon candidat "app pilote" |
| entcore/timeline (×2) + auth | 0 | **Nulle** | Hors scope, déjà en prod en multi-chunk |
| form (formulaire + formulaire-public) | 0 | **Nulle si sous-tâche fermée sans action** | À confirmer avec le PO |
| livret-scolaire-front-web *(hors ticket)* | 10 (7 routes arbre `/` + 3 arbre `/app`) | Moyenne | Aucune sous-tâche ne l'inclut ; pipeline de build/déploiement à clarifier avant de tester (cf. chapitre 13) |

**Estimation globale** : ~85-90 points de chargement lazy à valider manuellement sur le périmètre couvert par les 12 sous-tâches officielles (hors form, timeline×2, auth), répartis sur 10 apps distinctes + 2 sous-projets entcore — **+10 points supplémentaires si `livret-scolaire-front-web` est intégré au périmètre**, sous réserve qu'une sous-tâche soit créée pour elle. Recommandation : traiter en 2 vagues (pilotes à faible surface d'abord, puis apps à forte surface une fois le pattern validé), avec mesure de bundle avant/après à chaque app comme demandé dans le ticket.

## 6. Chapitres par application

1. [actualites](01-actualites.md)
2. [blog](02-blog.md)
3. [collaborative-wall](03-collaborative-wall.md)
4. [communities](04-communities.md)
5. [entcore](05-entcore.md) (portal, conversation, timeline, timeline-crna, auth)
6. [form](06-form.md) (formulaire, formulaire-public)
7. [homeworks](07-homeworks.md)
8. [mindmap](08-mindmap.md)
9. [rack](09-rack.md)
10. [support](10-support.md)
11. [wiki](11-wiki.md)
12. [collect](12-collect.md)
13. [livret-scolaire-front-web](13-livret-scolaire-front-web.md) — *hors périmètre du ticket, aucune sous-tâche ENABLING-999 associée (cf. §0)*
