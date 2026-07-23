# ENABLING-998 — Gate a11y automatique sur Storybook — notes d'investigation

Ticket : https://edifice-community.atlassian.net/browse/ENABLING-998

Ce fichier consigne les investigations menées avant implémentation, pour reprendre le
sujet sans tout re-creuser. **Rien n'est encore implémenté** ; certains points restent
à trancher (voir dernière section).

## Contexte initial du ticket

L'audit (finding 5.3) relève que `@storybook/addon-a11y` est installé et enregistré
dans `main.ts`, mais n'est exploité que via le panneau manuel de Storybook — aucun
contrôle a11y automatique en CI. Deux options étaient proposées :

- **C1** : mutualiser avec le check a11y de Chromatic (ticket ENABLING-997, Chromatic
  sur PR).
- **C2** : `@storybook/test-runner` + `axe-playwright`, gate indépendant de Chromatic.

## État réel constaté du repo (2026-07-23)

- `@storybook/addon-a11y` **et** `@storybook/addon-vitest` (10.3.6) sont déjà tous les
  deux installés et déclarés dans `apps/docs/.storybook/main.ts`.
- Le `vitest.config.ts` racine définit déjà un projet `storybook` (via
  `storybookTest({ configDir: 'apps/docs/.storybook' })`, Playwright/chromium headless).
  C'est l'équivalent moderne de `@storybook/test-runner`. Ceci a fait naître une
  troisième piste possible, **C3**, explorée ci-dessous et abandonnée.
- Storybook 10 fait l'intégration a11y↔vitest **automatiquement** dès que les deux
  addons sont présents (confirmé via lecture du bundle `@storybook/addon-a11y/preview`) :
  `parameters.a11y.test` vaut `'todo'` (défaut, informatif, **invisible en CI** — les
  violations ne remontent que dans le panneau Storybook local) ou `'error'` (fait
  échouer le test vitest correspondant, visible en CI).
- **Mais rien ne fait tourner ce projet `storybook` en CI aujourd'hui** : le script
  `test` racine ne cible que `packages/react` ; `.github/workflows/tests.yml`
  (ENABLING-996) ne couvre que react/client.
- `.github/workflows/chromatic.yml` est en `workflow_dispatch` uniquement (ENABLING-997,
  statut Jira **"A FAIRE"**, pas commencé) — le check a11y natif de Chromatic (option C1)
  ne s'exécuterait donc jamais automatiquement sur une PR tant que ce trigger n'est pas
  ajouté. C1 n'est pas cassé techniquement, juste bloqué par ce séquencement.

## Option C3 (native addon-vitest) — abandonnée, bug upstream confirmé

Tentative de faire tourner le projet vitest `storybook` (`vitest run --project=storybook`)
en local : `No test files found`, alors que 123 fichiers `packages/react/src/**/*.stories.tsx`
existent bien sur disque.

Investigation :

1. Vérifié qu'un fichier de story (`EditorSkeleton.stories.tsx`) est du CSF3 valide
   (pas besoin de `test()`/`it()` explicite : c'est le principe de `addon-vitest`, il
   transforme chaque story exportée en cas de test).
2. Instrumenté (`console.error` temporaire, non commité) le plugin
   `@storybook/addon-vitest/dist/vitest-plugin/index.js` : le glob calculé est correct
   (`includeStories` contient bien `packages/react/src/**/*.stories.@(js|jsx|ts|tsx)`,
   `vitestRoot` = racine du repo).
3. Testé ce même glob directement avec la version exacte de `tinyglobby` (0.2.17)
   utilisée par ce `vitest@3.2.4` : 123 matches, extglob inclus. Le pattern fonctionne
   bien en isolation.
4. Recherche : bug upstream confirmé, encore ouvert —
   [storybookjs/storybook#34554](https://github.com/storybookjs/storybook/issues/34554).
   Root cause : le hook `config()` du plugin `storybookTest` fixe `root` au parent de
   `configDir` (`apps/docs/`), mais calcule `test.include` relativement à `vitestRoot`
   (repo root, via fallback `process.cwd()`). Vitest résout ensuite `test.include`
   relativement à `root` → cherche `apps/docs/packages/react/src/**/*` (inexistant).
   Bug qui n'apparaît que quand `configDir` n'est pas un enfant direct de la racine
   vitest (notre cas : `apps/docs/.storybook` sous un monorepo).
5. Testé le workaround documenté dans l'issue (plugin Vite `enforce: 'post'` qui
   réinitialise `root` à la racine du repo après `storybookTest`) : corrige bien le
   `No test files found`, mais fait immédiatement apparaître une seconde erreur en
   cascade sur les 123 stories : `Error: Vitest failed to find the current suite. This
   is a bug in Vitest.` — reconnu comme un bug par le message lui-même. Le workaround
   n'est donc pas praticable tel quel.

**Conclusion** : ce n'est pas une erreur de configuration de notre côté. C'est une
combinaison de bugs upstream (Storybook 10.3.6 + `addon-vitest` + `vitest@3.2.4` dans
ce layout monorepo), pas fixable dans un temps raisonnable. Le projet vitest `storybook`
existant est donc aujourd'hui **non fonctionnel et inutilisé**, indépendamment de l'a11y.
Toutes les modifications de test (préview.tsx, vitest.config.ts, patch du node_modules)
ont été **annulées** (`git status` propre après investigation).

→ Possible ticket de suivi séparé pour signaler/fixer ce bug (hors scope 998).

## Licence axe-core / axe-playwright

Vérifié (pas d'hypothèse) :

- `axe-core` : licence **MPL-2.0**, open source.
- `axe-playwright` : licence **MIT**, open source.
- `@storybook/addon-a11y` (déjà installé) dépend lui-même directement de `axe-core` —
  même moteur, déjà utilisé aujourd'hui par le panneau manuel.

Aucune licence payante requise pour C2. La licence "Axe DevTools **Extension**" (plan
Pro, 650€/an, renouvelée jusqu'en 06/2027) est un produit commercial Deque différent —
une extension navigateur pour de l'audit manuel/interactif (crédits IA, tests guidés),
sans rapport avec `axe-core`/`axe-playwright` en CI. Décision de garder ou résilier cet
abonnement hors scope de ce ticket.

## Décisions actées (validées explicitement)

- **Mode informatif** : visible en CI (pas silencieux) mais **non-bloquant** — les
  violations doivent apparaître dans les logs de la PR pour permettre le tri, sans
  faire échouer le merge.
- **CI** : si gate indépendant de Chromatic, ce sera un nouveau job dans
  `.github/workflows/tests.yml` (pas un workflow séparé).

## Pas encore tranché — à reprendre à la prochaine session

- **Approche technique** : C3 est éliminée (bug upstream). **C2 est la piste la plus
  évidente à ce stade** (dépendances confirmées compatibles et libres de droits — voir
  ci-dessus) mais **rien n'est choisi/validé formellement**.
- **Sort de C1** (Chromatic) par rapport à 998 — question posée, pas encore répondue :
  1. Abandonner C1, rester sur C2 seul (Chromatic activable plus tard indépendamment,
     juste `parameters.a11y` dans `preview.tsx`, une fois ENABLING-997 fait).
  2. Inclure le trigger `pull_request` minimal de ENABLING-997 dans ce ticket (fait
     avancer 997 par la bande).
  3. Traiter ENABLING-997 comme un ticket à part entière, avant de revenir à 998.
- **Scope du tri des violations existantes** : ce ticket inclut-il la correction/le
  ignore explicite des violations a11y déjà présentes, ou juste la mise en place du
  gate (tri laissé à un ticket de suivi) ? Réponse donnée : "pas sûr" — à retrancher.
- Implémentation concrète (pas commencée) : ajout des deps, config
  `apps/docs/.storybook/test-runner.ts` (hooks `preVisit`/`postVisit` avec
  `injectAxe`/`checkA11y`), job CI (build Storybook, servir, lancer `test-storybook`,
  arbitrage sur les dépendances additionnelles éventuelles — `wait-on`/`concurrently`
  vs. petite boucle bash — pour éviter d'ajouter des deps superflues).
