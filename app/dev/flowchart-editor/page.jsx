import { notFound } from 'next/navigation';
import FlowchartEditorClient from './FlowchartEditorClient';

export const metadata = {
  title: 'Flowchart editor (dev)',
  robots: { index: false, follow: false },
};

export default function FlowchartEditorPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <FlowchartEditorClient />;
}
