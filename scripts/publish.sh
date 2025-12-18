#!/bin/bash

if [ ! -e node_modules ]
then
  mkdir node_modules
fi

if [ -z ${USER_UID:+x} ]
then
  export USER_UID=1000
  export GROUP_GID=1000
fi

# options
SPRINGBOARD="recette"
for i in "$@"
do
case $i in
    -s=*|--springboard=*)
    SPRINGBOARD="${i#*=}"
    shift
    ;;
    *)
    ;;
esac
done

clean () {
  rm -rf node_modules
  rm -f pnpm-lock.yaml
  
  rm -rf packages/**/node_modules
  rm -rf packages/**/dist
  rm -rf packages/**/.turbo
}

init () {
  echo "[init] Install dependencies..."

  # Installation des dépendances
  docker compose run -e NPM_TOKEN=$NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install"
}

build () {
  echo "[build] Build packages..."

  # Build des packages
  docker compose run -e NPM_TOKEN=$NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm run build"
}

publish () {
  echo "[publish] Publish packages..."
  # Récupération de la branche locale
  LOCAL_BRANCH=`echo $GIT_BRANCH | sed -e "s|origin/||g"`
  # Récupération de la date et du timestamp
  TIMESTAMP=`date +%Y%m%d%H%M%S`
  # Récupération du dernier tag stable
  LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "1.0.0")
  LATEST_TAG=${LATEST_TAG#v}

  # Définition du tag de la branche
  if [ "$LOCAL_BRANCH" = "main" ]; then
    TAG_BRANCH="latest"
  else
    TAG_BRANCH=$LOCAL_BRANCH
  fi


  # Création de la nouvelle version
  if [ "$LOCAL_BRANCH" = "main" ]; then
    NEW_VERSION="$LATEST_TAG"
  else
    # Mettre à jour la version dans tous les packages avec la version exacte
    NEW_VERSION="$LATEST_TAG-$LOCAL_BRANCH.$TIMESTAMP"
    echo "[publish] Update version in all packages with the exact version"
    docker compose run -e NPM_TOKEN=$NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm -r exec npm version $NEW_VERSION --no-git-tag-version"
  fi

  # Publier avec le tag de la branche
  echo "[publish] Publish with the branch tag"
  # Default to dry run if not specified
  DRY_RUN=${DRY_RUN:-true}
  
  if [ "$DRY_RUN" = "true" ]; then
    docker compose run -e NPM_TOKEN=$NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm publish -r --no-git-checks --tag $TAG_BRANCH --dry-run"
  else
    docker compose run -e NPM_TOKEN=$NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm publish -r --no-git-checks --tag $TAG_BRANCH --access public"
  fi
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    init)
      init
      ;;
    build)
      build
      ;;
    install)
      init && build
      ;;
    publish)
      publish
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done