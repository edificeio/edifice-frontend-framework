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
