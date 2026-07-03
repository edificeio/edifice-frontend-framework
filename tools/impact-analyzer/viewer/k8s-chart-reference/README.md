# Référence pour le dépôt Helm du viewer Impact Analyzer

Ce dossier **ne fait pas partie du déploiement** : c'est une référence pour
créer le vrai dépôt Helm, qui doit vivre sur `gitlab-infra.ode.tools`, jamais
sur GitHub (règle explicite du [guide de livraison](https://edifice-community.atlassian.net/wiki/spaces/ODE/pages/4610392074)).

Config validée par l'équipe SRE : cluster `k8s-preprod-services`, secret via
Vault, Gateway `private-gateway`, hostname `impact-analyzer-viewer.ode.tools`.

## Procédure (résumé du guide de livraison)

1. Créer un nouveau dépôt Git dans
   [`gitlab-infra.ode.tools/kubernetes/helm-charts`](https://gitlab-infra.ode.tools/kubernetes/helm-charts),
   nom recommandé : `chart-impact-analyzer-viewer`.
2. Cloner, puis `helm create .` et supprimer les fichiers générés par défaut
   (`rm -rf templates/* values.yaml`).
3. Copier `Chart.yaml.example` → `Chart.yaml` et `values.yaml.example` →
   `values.yaml` dans ce nouveau dépôt.
4. `helm dependency build` pour vérifier que la dépendance
   `boilerplate-deployment` se télécharge correctement (nécessite l'accès au
   repo Helm Nexus, cf. guide).
5. Ajouter un manifeste ArgoCD dans le dépôt
   [`argo-apps`](https://gitlab-infra.ode.tools/kubernetes/argo-apps)
   (`k8s-preprod-services`) et ouvrir une MR vers `main`.

## Dernier point à vérifier avec SRE au premier déploiement

`vaultSecrets` (dans `values.yaml.example`) crée un Secret Kubernetes à
partir du chemin Vault fourni, mais le nom exact de ce Secret et sa clé (pour
l'exposer en variable d'env `DATA_REPO_GITHUB_TOKEN`, probablement via une
entrée `extraEnvs` avec `secretKeyRef`) n'ont pas été confirmés dans cette
passe — à valider avec SRE avant de considérer le déploiement fonctionnel.

## Secrets côté GitHub Actions (ce repo, pas gitlab-infra)

Pour que `.github/workflows/impact-analyzer-viewer-release.yml` puisse
pousser l'image, deux secrets doivent être ajoutés sur
`edifice-frontend-framework` (Settings → Secrets and variables → Actions) :
- `CI_REGISTRY_USER` : `github-actions-docker`
- `CI_REGISTRY_PASSWORD` : fourni par SRE une fois le lien du repo transmis.

## Token à transmettre à SRE

Un fine-grained PAT GitHub **lecture seule**, scopé **uniquement** au repo
`edificeio/impact-analyzer-data`, à transmettre directement à SRE (pas via
Claude) — ils l'ajoutent dans Vault, Kubernetes le montera ensuite.
