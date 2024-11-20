import { Plugin } from "vite";

export function removeDsn({
  includeExtensions,
  excludeExtensions,
}: {
  includeExtensions: string[];
  excludeExtensions: string[];
}): Plugin {
  const regex = (arg) =>
    new RegExp(`(${arg.join("|").replace(/\./g, "\\.")})$`);

  const includeRegex = regex(includeExtensions);
  const excludeRegex = regex(excludeExtensions);

  return {
    name: "remove-display-name",
    transform(code, id) {
      if (includeRegex.test(id) && !excludeRegex.test(id)) {
        const updatedCode = code.replace(
          /[\w$]+\.displayName\s*=\s*["'].*["'];?/g,
          "",
        );
        return {
          code: updatedCode,
          map: null,
        };
      }
    },
  };
}
