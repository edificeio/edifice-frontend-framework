# Référence pour le dépôt Helm du viewer Impact Analyzer

Ce dossier **ne fait pas partie du déploiement** : c'est une référence pour
créer le vrai dépôt Helm, qui doit vivre sur `gitlab-infra.ode.tools`, jamais
sur GitHub (règle explicite du [guide de livraison](https://edifice-community.atlassian.net/wiki/spaces/ODE/pages/4610392074)).

## Procédure (résumé du guide de livraison)

1. Créer un nouveau dépôt Git dans
   [`gitlab-infra.ode.tools/kubernetes/helm-charts`](https://gitlab-infra.ode.tools/kubernetes/helm-charts),
   nom recommandé : `chart-impact-analyzer-viewer`.
2. Cloner, puis `helm create .` et supprimer les fichiers générés par défaut
   (`rm -rf templates/* values.yaml`).
3. Copier `Chart.yaml.example` → `Chart.yaml` et `values.yaml.example` →
   `values.yaml` dans ce nouveau dépôt, en complétant les `TODO` (voir
   ci-dessous).
4. `helm dependency build` pour vérifier que la dépendance
   `boilerplate-deployment` se télécharge correctement (nécessite l'accès au
   repo Helm Nexus, cf. guide).
5. Ajouter un manifeste ArgoCD dans le dépôt
   [`argo-apps`](https://gitlab-infra.ode.tools/kubernetes/argo-apps)
   (cluster/namespace à confirmer avec SRE) et ouvrir une MR vers `main`.

## À compléter avant le premier déploiement réel (pas fait dans cette passe)

- **Cluster cible** : probablement `k8s-preprod-services` vu la nature
  interne de l'outil, à confirmer avec SRE — détermine aussi si le secret du
  token se gère via Vault (OVH) ou Scaleway Secrets Manager.
- **Nom du Gateway** (`httpRoutes[].parentRefs[].name`) et **hostname**
  public/interne à utiliser.
- **Secret `DATA_REPO_GITHUB_TOKEN`** : un fine-grained PAT GitHub en lecture
  seule, scopé uniquement à `edificeio/impact-analyzer-data` — à créer et à
  faire créer comme Secret Kubernetes par SRE (mécanisme exact — Vault vs
  Scaleway — cf. commentaires dans `values.yaml.example`).

## Secrets côté GitHub Actions (ce repo, pas gitlab-infra)

Pour que `.github/workflows/impact-analyzer-viewer-release.yml` puisse
pousser l'image, deux secrets doivent être ajoutés sur
`edifice-frontend-framework` (Settings → Secrets and variables → Actions) :
- `CI_REGISTRY_USER`
- `CI_REGISTRY_PASSWORD`

Credentials du [registry Nexus](https://maven.opendigitaleducation.com) —
mêmes identifiants que pour `helm repo add`/`docker login` décrits dans les
guides Confluence.
