export function formatSolde(soldeStr: string): string {
  if (typeof soldeStr !== 'string' || soldeStr.length === 0) {
    return soldeStr;
  } else if (soldeStr.length === 1) {
    return `0,0${soldeStr}`;
  } else if (soldeStr.length === 2) {
    return `0,${soldeStr}`;
  }
  return `${soldeStr.substring(0, soldeStr.length - 2)},${soldeStr.substring(
    soldeStr.length - 2,
  )}`;
}
