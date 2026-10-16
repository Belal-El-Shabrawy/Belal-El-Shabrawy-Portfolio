// A script that runs while the HTML is still being parsed, before first paint.
// From node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md:
// on the client it renders as text/plain, so React neither runs it again on a
// client-side navigation nor warns about rendering a <script>.
const InlineScript = ({ html }) => (
    <script
        type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
    />
);

export default InlineScript;
