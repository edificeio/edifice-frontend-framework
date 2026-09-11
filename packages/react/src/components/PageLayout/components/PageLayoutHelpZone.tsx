import { HelpZoneContainer } from '../../HelpZone/HelpZoneContainer';

/**
 * Opt-in slot: renders the floating Edifice help zone (badge + support
 * button). Requires `EdificeClientProvider` and `EdificeThemeProvider`
 * higher in the tree (used internally by `useZendeskGuide`) — kept opt-in
 * rather than baked into `PageLayout` itself so standalone consumers
 * without those providers don't crash at render.
 */
const PageLayoutHelpZone = () => <HelpZoneContainer />;

PageLayoutHelpZone.displayName = 'PageLayout.HelpZone';

export default PageLayoutHelpZone;
