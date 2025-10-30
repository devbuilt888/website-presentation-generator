import { notFound } from 'next/navigation';
import PresentationViewer from '@/components/PresentationViewer';
import { presentations } from '@/data/presentations';

interface PresentationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  const { id } = await params;
  const presentation = presentations.find(p => p.id === id);
  
  if (!presentation) {
    notFound();
  }

  return <PresentationViewer presentation={presentation} />;
}
