import { useEffect, useState } from 'react';

import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { IconBurgerMenu } from '../../../modules/icons/components';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useEdificeTheme } from '../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';
import { Button } from '../../Button';

export function useHelp(
  hasOldHelpEnableWorkflow: boolean | Record<string, boolean>,
) {
  const { appCode } = useEdificeClient();
  const { theme } = useEdificeTheme();

  const [html, setHtml] = useState<string>('');
  const [visibility, setVisibility] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('présentation');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const helpPath = theme?.is1d ? '/help-1d' : '/help-2d';

  useEffect(() => {
    if (!hasOldHelpEnableWorkflow) {
      return;
    }

    (async () => {
      let helpURL = '';
      helpURL = helpPath + '/application/' + appCode + '/';
      if (!appCode && window.location.pathname !== '/adapter') {
        helpURL = helpPath + '/application/portal/';
      } else if (window.location.pathname === '/adapter') {
        helpURL =
          helpPath +
          '/application/' +
          window.location.search.split('eliot=')[1].split('&')[0] +
          '/';
      } else if (window.location.pathname.includes('/directory/class-admin')) {
        helpURL = helpPath + '/application/parametrage-de-la-classe/';
      } else if (
        window.location.pathname.includes('/userbook/mon-compte') ||
        window.location.pathname.includes('/timeline/preferencesView') ||
        window.location.pathname.includes('/timeline/historyView')
      ) {
        helpURL = helpPath + '/application/userbook/';
      }

      try {
        const res = await fetch(helpURL);
        const html = (await res.text()) as any;

        if (res.status === 404) {
          setError(true);
          return;
        }

        setHtml(html);
        setError(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    })();
  }, [appCode, helpPath]);

  const options = {
    replace: (domNode: any) => {
      const typedDomNode = domNode as any;
      const isActive = typedDomNode.attribs?.id === activeSection;

      if (typedDomNode.attribs && typedDomNode.attribs.id === 'TOC') {
        return (
          <nav id="TOC">
            <Button
              onClick={() => {
                setVisibility(!visibility);
              }}
            >
              <IconBurgerMenu />
            </Button>
            {domToReact(typedDomNode.children, {
              replace: (domNode: any) => {
                const typedDomNode = domNode as any;

                if (typedDomNode.attribs && typedDomNode.name === 'ul') {
                  return (
                    <ul
                      id="TOC-list"
                      style={{
                        display: visibility ? 'block' : 'none',
                      }}
                    >
                      {domToReact(typedDomNode.children, {
                        replace: (domNode: any) => {
                          const typedDomNode = domNode as any;

                          if (
                            typedDomNode.attribs &&
                            typedDomNode.name === 'a'
                          ) {
                            const sectionId = typedDomNode.attribs.href.replace(
                              '#',
                              '',
                            );
                            return (
                              <span
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveSection(sectionId);
                                  setVisibility(false);
                                }}
                              >
                                {domToReact(typedDomNode.children)}
                              </span>
                            );
                          }
                        },
                      })}
                    </ul>
                  );
                }
              },
            })}
          </nav>
        );
      }

      if (
        typedDomNode.attribs &&
        typedDomNode.attribs.class === 'section level2'
      ) {
        const props = attributesToProps(domNode.attribs);
        return (
          <div {...props} className="section level2" hidden={!isActive}>
            {domToReact(typedDomNode.children, {
              replace: (domNode: any) => {
                const typedDomNode = domNode as any;

                if (typedDomNode.attribs && typedDomNode.name === 'img') {
                  const attribs = domNode.attribs.src;
                  return (
                    <img
                      {...attributesToProps(typedDomNode.attribs)}
                      src={`${helpPath}/${attribs}`}
                      alt=""
                    />
                  );
                }
              },
            })}
          </div>
        );
      }
    },
  };

  const parsedHTML = parse(html, options);

  // @ts-expect-error
  const parsedContent = parsedHTML?.props?.children.find(
    (child: { type: string }) => child.type === 'body',
  )?.props?.children;

  const parsedHeadline = parsedContent?.find(
    (child: { type: string }) => child.type === 'p',
  )?.props?.children;

  return {
    html,
    visibility,
    isModalOpen,
    setIsModalOpen,
    parsedContent,
    parsedHeadline,
    error,
  };
}
