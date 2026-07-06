# Référence pour le dépôt Helm du viewer Impact Analyzer

Ce dossier **ne fait pas partie du déploiement** : c'est une référence pour
le vrai dépôt Helm, qui vit sur `gitlab-infra.ode.tools`, jamais sur GitHub
(règle explicite du [guide de livraison](https://edifice-community.atlassian.net/wiki/spaces/ODE/pages/4610392074)).

Config entièrement validée par l'équipe SRE : cluster `k8s-preprod-services`,
secret via Vault (`impact-analyzer-data-token`, clé `token`), Gateway
`private-gateway`, hostname `impact-analyzer-viewer.ode.tools`.

## État d'avancement

- [x] Dépôt `chart-impact-analyzer-viewer` créé sur gitlab-infra.
- [x] Secrets GitHub Actions ajoutés (`CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`).
- [x] PAT `DATA_REPO_GITHUB_TOKEN` créé et transmis à SRE, stocké dans Vault.
- [x] `Chart.yaml`/`values.yaml` copiés dans le dépôt gitlab-infra
      (`Chart.yaml.example`/`values.yaml.example` de ce dossier).
- [x] `helm dependency build` vérifié.
- [ ] Manifeste ArgoCD ajouté sur `argo-apps` + MR ouverte.
- [ ] Premier tag `impact-analyzer-viewer-v0.1.0` poussé sur ce repo pour
      déclencher le premier build/scan/push réel de l'image.

### Note : ignore Trivy temporaire

Le scan Trivy du premier run a bloqué sur 6 CVE `libssl3` (1 CRITICAL, 5
HIGH) qui viennent uniquement du snapshot Debian utilisé par l'image de base
`gcr.io/distroless/nodejs22-debian12:nonroot` (retard de publication côté
Google — confirmé : `gcr.io/distroless/base-debian12:nonroot` est déjà sur
Debian 12.14, qui contient le correctif ; `nodejs24-debian12:nonroot` a
exactement les mêmes CVE, donc pas lié à la version de Node). Rien à corriger
dans notre Dockerfile. Un ignore scopé et daté a été ajouté :
`tools/impact-analyzer/viewer/.trivyignore` — à supprimer dès que l'image
`nodejs22-debian12:nonroot` republiée par Google passe sur Debian ≥12.14
(pas d'ETA annoncée par Google ; vérifier en relançant le workflow
périodiquement).

## Procédure restante (résumé du guide de livraison)

1. Copier `Chart.yaml.example` → `Chart.yaml` et `values.yaml.example` →
   `values.yaml` dans le dépôt `chart-impact-analyzer-viewer`.
2. `helm dependency build` pour vérifier que la dépendance
   `boilerplate-deployment` se télécharge correctement.
3. Pousser un tag `impact-analyzer-viewer-v0.1.0` sur ce repo pour que le
   workflow GitHub Actions construise, scanne et pousse la première image.
4. Ajouter un manifeste ArgoCD dans le dépôt
   [`argo-apps`](https://gitlab-infra.ode.tools/kubernetes/argo-apps)
   (cluster `k8s-preprod-services`) et ouvrir une MR vers `main`.
