// Branch naming isn't consistent across app repos (some call their
// mainline "develop", others "dev" — see apps.json) even though they play
// the same role relative to "develop-enabling". Grouping by this key lets a
// cross-app filter (e.g. the Symboles tab) treat them as one bucket instead
// of splitting usage across two entries that mean the same thing.
export function branchGroupKey(appBranch: string): string {
  return appBranch === 'dev' ? 'develop' : appBranch;
}

export function branchGroupLabel(groupKey: string): string {
  return groupKey === 'develop' ? 'develop / dev' : groupKey;
}
