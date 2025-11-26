import { notFound } from 'next/navigation';
import PresentationViewer from '@/components/PresentationViewer';
import ThreeDPresentationViewer from '@/components/ThreeDPresentationViewer';
import ForestPresentationViewer from '@/components/ForestPresentationViewer';
import OmegaBalancePresentationViewer from '@/components/OmegaBalancePresentationViewer';
import OmegaBalanceSpacePresentationViewer from '@/components/OmegaBalanceSpacePresentationViewer';
import OmegaBalancePlusPresentationViewer from '@/components/OmegaBalancePlusPresentationViewer';
import OmegaBalanceNewPresentationViewer from '@/components/OmegaBalanceNewPresentationViewer';
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

  // Use 3D space viewer for Super Presentation Pro
  if (presentation.id === 'super-presentation-pro') {
    return <ThreeDPresentationViewer presentation={presentation} />;
  }

  // Use forest viewer for forest night journey
  if (presentation.id === 'forest-night-journey') {
    return <ForestPresentationViewer presentation={presentation} />;
  }

  // Use interactive omega balance viewer
  if (presentation.id === 'omega-balance') {
    return <OmegaBalancePresentationViewer presentation={presentation} />;
  }

  // Use space-themed omega balance viewer
  if (presentation.id === 'omega-balance-space') {
    return <OmegaBalanceSpacePresentationViewer presentation={presentation} />;
  }

  // Use omega balance plus viewer with floating 3D assets
  if (presentation.id === 'omega-balance-plus') {
    return <OmegaBalancePlusPresentationViewer presentation={presentation} />;
  }

  // Use omega balance new viewer with pattern backgrounds
  if (presentation.id === 'omega-balance-new') {
    return <OmegaBalanceNewPresentationViewer presentation={presentation} />;
  }

  return <PresentationViewer presentation={presentation} />;
}
