import ContactClient from '@/components/ContactClient';

export const metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description:
    'Get in touch with Belal Alaa El-Shabrawy about software engineering roles, freelance work or collaboration.',
};

export default function ContactPage() {
  return <ContactClient />;
}
