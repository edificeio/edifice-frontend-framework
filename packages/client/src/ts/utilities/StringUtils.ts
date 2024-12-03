import { defaultDiacriticsRemovalMap } from "../idiom/Idiom";

export class StringUtils {
  static removeAccents(str: string): string {
    for (let i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
      str = str.replace(
        defaultDiacriticsRemovalMap[i].letters,
        defaultDiacriticsRemovalMap[i].base,
      );
    }
    return str;
  }
}
