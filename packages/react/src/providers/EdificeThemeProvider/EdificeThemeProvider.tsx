import { useEffect, useMemo, type ReactNode } from "react";

import { IOdeTheme } from "@edifice.io/ts-client";
import { useConf } from "../../hooks";
import { useEdificeClient } from "../EdificeClientProvider/EdificeClientProvider.hook";
import { EdificeThemeContext } from "./EdificeThemeProvider.context";

export interface EdificeThemeProps {
  children: ReactNode;
  defaultTheme?: "one" | "neo" | "none";
}

export interface EdificeThemeContextProps {
  theme: IOdeTheme | undefined;
}

export function EdificeThemeProvider({
  defaultTheme,
  children,
}: EdificeThemeProps) {
  const { appCode } = useEdificeClient();

  const confQuery = useConf({ appCode });

  useEffect(() => {
    const favicon = document.getElementById("favicon") as HTMLAnchorElement;
    favicon.href =
      `${confQuery?.data?.theme?.basePath}/img/illustrations/favicon.ico` as string;
    const bootstrapVersion =
      confQuery?.data?.theme?.bootstrapVersion?.split("-");
    const dataProduct = bootstrapVersion
      ? bootstrapVersion[bootstrapVersion.length - 1]
      : undefined;

    const attributes = [
      {
        data: "data-skin",
        value: confQuery?.data?.theme?.skinName,
      },
      {
        data: "data-theme",
        // WB2-1885, add npmTheme for dynamic theme on springboard
        value:
          confQuery?.data?.theme?.npmTheme ?? confQuery?.data?.theme?.themeName,
      },
      {
        data: "data-product",
        value: defaultTheme === "none" ? "" : (defaultTheme ?? dataProduct),
      },
    ];

    attributes.forEach((attribute) => {
      return document
        .querySelector("html")
        ?.setAttribute(attribute.data, attribute.value as string);
    });
  }, [confQuery?.data, defaultTheme]);

  const values = useMemo(
    () => ({
      theme: confQuery?.data?.theme,
    }),
    [confQuery?.data?.theme],
  );

  return (
    <EdificeThemeContext.Provider value={values}>
      {children}
    </EdificeThemeContext.Provider>
  );
}