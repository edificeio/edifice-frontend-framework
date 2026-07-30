# ENABLING-1099 · 3 — Méthode de mesure

↩ [Document principal](../../ENABLING-1099-NORME-VERSIONS-PACKAGES.md) · [1 — Constats](1-constats.md) · [2 — Actions](2-actions.md)

---

## Lire la configuration d'un repo

**Toujours lire sur la branche d'intégration de référence, jamais dans le working tree** : les branches
checkoutées localement sont arbitraires et donnent des valeurs qui ne sont celles d'aucun environnement.

```sh
git show origin/develop:frontend/package.json
```

La branche de référence n'a pas le même nom partout :

| Branche de référence | Repos |
| --- | --- |
| `origin/develop` | blog, collaborative-wall, communities, mindmap, wiki, collect, explorer |
| `origin/dev` | actualites, entcore, homeworks, rack, support |
| `origin/main` | edifice-react-boilerplate |

Cas particuliers :

- **`explorer/frontend/package.json` est un artefact généré et commité** : la source de vérité est
  `package.json.template`.
- `entcore/portal` et `entcore/conversation` existent dans certains clones locaux mais sur aucune branche
  distante d'`entcore` : hors périmètre.

---

## Compter les copies depuis la branche de référence *(méthode recommandée)*

Reproductible, indépendante de l'état des clones locaux, et applicable à tous les fronts sans installer
quoi que ce soit. C'est la méthode qui produit les chiffres de [1 — Constats](1-constats.md).

```sh
# 1. Reconstruire la config du front dans un répertoire vide
mkdir -p /tmp/mesure && cd /tmp/mesure
git -C /chemin/vers/rack show origin/dev:frontend/package.json > package.json
# Pour un workspace, ajouter aussi pnpm-workspace.yaml, le package.json racine
# et celui de chaque membre listé (les overrides racine sont indispensables).

# 2. Résoudre sans installer
pnpm install --lockfile-only --ignore-scripts

# 3. Compter les copies physiques et les versions
grep -cE "^  '?@edifice\.io/react@.*\("   pnpm-lock.yaml   # copies
grep -oE "^  '?@edifice\.io/react@[^'(]+" pnpm-lock.yaml | sort -u   # versions
```

Chaque entrée de `snapshots:` correspond à un répertoire physique que produirait l'install. Plus d'une
copie = duplication.

Limites : la résolution évalue les ranges `^` **à la date d'exécution**, donc les peers en range peuvent
différer d'un arbre installé plus ancien. Et un front dont les dépendances passent par un registre privé
(`@tiptap-pro`) n'est pas résolvable sans jeton — dans ce cas, mesurer l'arbre installé (ci-dessous).

Pour identifier quel importeur tire quelle variante, lire la section `snapshots:` du lockfile : la clé de
chaque variante porte les peers résolus entre parenthèses.

---

## Compter les copies dans un arbre installé

Trois précautions, sans lesquelles le comptage est faux :

1. **`node_modules/.pnpm` n'est pas purgé** entre deux `pnpm install` : des répertoires orphelins
   subsistent, sans consommateur. Ils ne comptent pas.
2. **Seules comptent les copies résolues par un importeur**, suivies par `realpath`. Exclure
   `.pnpm/<PKG>@*/node_modules/<PKG>` : c'est le domicile du paquet, pas un importeur.
3. **Vérifier l'absence de lien local** (`pnpm link`) : le cas échéant, la mesure reflète une machine de
   dev et non la CI.

Le `node_modules` local reflète la branche du **dernier install** : la préciser à côté de toute mesure.

```sh
# Répertoires présents sur disque — inclut les orphelins, ne pas conclure là-dessus
ls -d node_modules/.pnpm/@edifice.io+react@* | sed 's|.*/||'

# Copies ACTIVES — la mesure qui compte
PKG=@edifice.io/react; FS=$(echo "$PKG" | tr '/' '+')
for l in node_modules/$PKG */node_modules/$PKG node_modules/.pnpm/*/node_modules/$PKG; do
  [ -e "$l" ] || continue
  case "$l" in *".pnpm/$FS@"*) continue;; esac
  printf '%-56s -> %s\n' "${l:0:56}" \
    "$(python3 -c 'import os,sys;print(os.path.realpath(sys.argv[1]))' "$l" \
       | sed 's|.*/.pnpm/||; s|/node_modules.*||')"
done
# Compter les cibles distinctes : > 1 = duplication active.

# Lien local vers le socle ? Si oui, mesure non représentative de la CI
ls -l frontend/node_modules/@edifice.io/react
```

`pnpm why --recursive <pkg>` donne une vue logique de l'arbre, mais **présente les variantes de peers comme
une version unique** : il masque la cause dominante de duplication. Ne pas s'en servir pour compter.

---

## Inspecter un package publié

```sh
# Specs publiées : dist-tag, version exacte, ou fuite de workspace: ?
npm view <pkg>@<tag> version dependencies --json

# peerDependencies déclarées
npm view <pkg>@<tag> peerDependencies --json

# Tous les dist-tags
npm view @edifice.io/react dist-tags --json
```

Contrôle après publication depuis un workspace — doit être vide :

```sh
npm view <pkg>@<tag> dependencies --json | grep workspace:
```

---

## Simuler une résolution

Sans rien installer, pour tester l'effet d'un override ou d'un jeu de `peerDependencies` :

```sh
pnpm install --lockfile-only --ignore-scripts
```

Puis compter les entrées `snapshots:` du package dans `pnpm-lock.yaml` : c'est le nombre de répertoires
physiques que produirait l'install.

Attention : cette simulation résout les ranges `^` **à la date d'exécution**. Elle donne une borne haute et
illustre la dérive dans le temps, mais ne reflète pas l'état d'un arbre déjà installé.
