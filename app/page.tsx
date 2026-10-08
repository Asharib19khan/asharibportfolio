import SiteShell from '../components/layout/SiteShell';

// Server component: the full page (all sections, all copy) is in the initial HTML,
// so crawlers and link-preview bots see real content instead of an empty shell.
export default function Home() {
  return <SiteShell />;
}
