import Projects from '@/components/Projects';

export const metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects',
  description:
    'Selected work by Belal Alaa El-Shabrawy: a Cairo University Q&A CMS and AI assistant, the Clinica Joelle clinic site, an AI-integrated WhatsApp bot and more.',
};

export default function ProjectsPage() {
  return <Projects />;
}
