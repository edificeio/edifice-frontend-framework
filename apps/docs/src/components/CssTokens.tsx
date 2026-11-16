import { useEffect, useState, type CSSProperties } from 'react';

/**
 * Doc tables generated from the CSS actually loaded in Storybook
 * (`@edifice.io/bootstrap/dist/index.css`), so they never drift from the
 * values synced from Figma.
 */

/** Themes documented in the design system. Client themes are left out on purpose. */
export const DOC_THEMES = ['edifice2d', 'edifice1d', 'neo', 'one'] as const;

const PRIMITIVE_PREFIX = '--primitive-';

/**
 * Old Bootstrap theme variables, also declared on `[data-product=neo|one]`.
 * They are not part of the design system.
 */
const LEGACY_BOOTSTRAP_PREFIX = '--edifice-';

/** Client-specific primitives are never shown in the docs. */
const CLIENT_PRIMITIVE = /^clients-/;

/** Primitive groups, matched on the name without the `--primitive-` prefix. */
export const PRIMITIVE_GROUPS = {
  'neutral': /^(black|white|grey-)/,
  'orange': /^orange-/,
  'yellow': /^yellow-/,
  'blue': /^blue-/,
  'green': /^green-/,
  'pink': /^pink-/,
  'support': /^(info|danger|warning|success)-/,
  'accessible': /^accessible-/,
  'text': /^text-color-/,
  'numbers': /^numbers-/,
  'spacing': /^(spacer-|gutters$)/,
  'radius': /^border-radius-/,
  'font': /^font-/,
  'layout': /^(container-|box-shadow$)/,
  'legacy-neo': /^neo-/,
  'legacy-one': /^one-/,
  'legacy-other': /^(legacy-|nabook$)/,
} satisfies Record<string, RegExp>;

/** Semantic theme variable groups, matched on the full custom property name. */
export const THEME_GROUPS = {
  'text-button': /^--color-text-button-/,
  'buttons': /^--color-buttons-/,
  'primary': /^--color-primary-/,
  'secondary': /^--color-secondary-/,
  'support': /^--color-support-/,
  'background': /^--color-background-/,
  'separator': /^--color-themeSeparator-/,
  'app': /^--color-app-/,
  'profil': /^--color-profil-/,
  'font-family': /^--font-family-/,
  'font-weight': /^--font-weight-/,
  'font-button': /^--font-button-/,
  'radius': /^--radius-/,
} satisfies Record<string, RegExp>;

const normalizeSelector = (selector: string) => selector.replace(/["'\s]/g, '');

/** Reads the custom properties declared by the loaded CSS rules matching `selector`. */
function readCustomProperties(selector: string): Map<string, string> {
  const target = normalizeSelector(selector);
  const properties = new Map<string, string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin sheets (e.g. Google Fonts) cannot be read.
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (
        !(rule instanceof CSSStyleRule) ||
        normalizeSelector(rule.selectorText) !== target
      ) {
        continue;
      }
      for (const name of Array.from(rule.style)) {
        if (name.startsWith('--')) {
          properties.set(name, rule.style.getPropertyValue(name).trim());
        }
      }
    }
  }
  return properties;
}

function useCustomProperties(selector: string) {
  const [properties, setProperties] = useState<Map<string, string>>(
    () => new Map(),
  );
  useEffect(() => {
    setProperties(readCustomProperties(selector));
  }, [selector]);
  return properties;
}

const isColor = (value: string) => /^(#|rgb|hsl)/.test(value);

const styles: Record<string, CSSProperties> = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '2px solid #e4e4e4',
  },
  td: {
    padding: '6px 12px',
    borderBottom: '1px solid #f2f2f2',
    fontFamily: 'monospace',
  },
  name: { color: '#3030d1' },
  swatch: {
    display: 'inline-block',
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
    verticalAlign: 'middle',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
  empty: { color: '#949494', fontStyle: 'italic' },
};

function TokenValue({ value }: { value?: string }) {
  if (!value) return <span style={styles.empty}>—</span>;
  return (
    <>
      {isColor(value) && (
        <span style={{ ...styles.swatch, backgroundColor: value }} />
      )}
      {value}
    </>
  );
}

function matchesNoGroup(name: string, groups: Record<string, RegExp>) {
  return !Object.values(groups).some((pattern) => pattern.test(name));
}

/**
 * Primitives emitted on `:root` for a group of `PRIMITIVE_GROUPS`.
 * `group="other"` lists the primitives no group matches, so a token newly
 * synced from Figma always shows up somewhere.
 */
export function PrimitiveTokens({
  group,
}: {
  group: keyof typeof PRIMITIVE_GROUPS | 'other';
}) {
  const properties = useCustomProperties(':root');

  const rows = Array.from(properties)
    .filter(([name]) => name.startsWith(PRIMITIVE_PREFIX))
    .map(([name, value]) => ({
      name,
      value,
      token: name.slice(PRIMITIVE_PREFIX.length),
    }))
    .filter(({ token }) => !CLIENT_PRIMITIVE.test(token))
    .filter(({ token }) =>
      group === 'other'
        ? matchesNoGroup(token, PRIMITIVE_GROUPS)
        : PRIMITIVE_GROUPS[group].test(token),
    );

  if (!rows.length) return <p style={styles.empty}>Aucune primitive.</p>;

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>CSS custom property</th>
          <th style={styles.th}>Variable Sass</th>
          <th style={styles.th}>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ name, token, value }) => (
          <tr key={name}>
            <td style={{ ...styles.td, ...styles.name }}>{name}</td>
            <td style={styles.td}>${token}</td>
            <td style={styles.td}>
              <TokenValue value={value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Semantic variables of a group of `THEME_GROUPS`, with each documented
 * theme's value side by side. `group="other"` lists the variables no group
 * matches.
 */
export function ThemeTokens({
  group,
}: {
  group: keyof typeof THEME_GROUPS | 'other';
}) {
  const edifice2d = useCustomProperties('[data-product=edifice2d]');
  const edifice1d = useCustomProperties('[data-product=edifice1d]');
  const neo = useCustomProperties('[data-product=neo]');
  const one = useCustomProperties('[data-product=one]');
  const byTheme = { edifice2d, edifice1d, neo, one };

  const names = Array.from(
    new Set(
      Object.values(byTheme).flatMap((props) => Array.from(props.keys())),
    ),
  )
    .filter((name) => !name.startsWith(LEGACY_BOOTSTRAP_PREFIX))
    .filter((name) =>
      group === 'other'
        ? matchesNoGroup(name, THEME_GROUPS)
        : THEME_GROUPS[group].test(name),
    );

  if (!names.length) return <p style={styles.empty}>Aucune variable.</p>;

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>CSS custom property</th>
          {DOC_THEMES.map((theme) => (
            <th key={theme} style={styles.th}>
              {theme}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {names.map((name) => (
          <tr key={name}>
            <td style={{ ...styles.td, ...styles.name }}>{name}</td>
            {DOC_THEMES.map((theme) => (
              <td key={theme} style={styles.td}>
                <TokenValue value={byTheme[theme].get(name)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** One card per documented theme, styled by the theme's own variables. */
export function ThemeOverview() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
        margin: '24px 0',
      }}
    >
      {DOC_THEMES.map((theme) => (
        <div
          key={theme}
          data-product={theme}
          style={{
            border: '1px solid #e4e4e4',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: 16,
              background: 'var(--color-primary-default)',
              color: 'var(--color-text-button-primary-filled-default)',
              fontFamily: 'var(--font-family-title)',
              fontWeight:
                'var(--font-weight-bold)' as CSSProperties['fontWeight'],
              fontSize: 18,
            }}
          >
            {theme}
          </div>
          <div style={{ padding: 16, fontSize: 14, lineHeight: 1.8 }}>
            <div style={{ fontFamily: 'var(--font-family-title)' }}>
              Titre — <code>--font-family-title</code>
            </div>
            <div style={{ fontFamily: 'var(--font-family-body)' }}>
              Corps — <code>--font-family-body</code>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {(['primary', 'secondary', 'tertiary'] as const).map(
                (variant) => (
                  <span
                    key={variant}
                    style={{
                      padding: '4px 12px',
                      background: `var(--color-buttons-${variant}-default)`,
                      color: `var(--color-text-button-${variant}-filled-default)`,
                      borderRadius: 'var(--radius-button)',
                      fontFamily: 'var(--font-button-family)',
                    }}
                  >
                    {variant}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
