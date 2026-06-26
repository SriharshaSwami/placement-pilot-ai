import { useQuery } from '@tanstack/react-query';
import { getRoadmap } from '@/services/career.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { AnalysisSection } from '@/features/ai/components/AnalysisSection.jsx';
import { AlertTriangle, TrendingUp, Zap, FileText } from 'lucide-react';

export default function RoadmapDetails() {
  const { data: roadmapRes, isLoading } = useQuery({
    queryKey: ['careerRoadmap'],
    queryFn: () => getRoadmap()
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!roadmapRes?.data) return <ErrorState message="No roadmap generated yet." />;

  const { roadmap, skillGap, resumeImprovements, portfolioSuggestions } = roadmapRes.data;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title={roadmap.title}
        description={`Target Role: ${roadmap.targetRole}`}
        backTo="/career"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisSection title="Strong Skills" icon={TrendingUp} items={skillGap.strongSkills} />
        <AnalysisSection title="Weak Skills" icon={AlertTriangle} items={skillGap.weakSkills} />
        <AnalysisSection title="Missing Skills" icon={Zap} items={skillGap.missingSkills} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisSection title="Resume Improvements" icon={FileText} items={resumeImprovements} />
        <AnalysisSection title="Portfolio Suggestions" icon={Zap} items={portfolioSuggestions} />
      </div>
    </div>
  );
}
