import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`bg-slate-700 rounded-md animate-pulse ${className}`} />
);

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6" aria-label="Loading data...">
      {/* Summary Panel Skeleton */}
       <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <SkeletonBox className="h-8 w-3/5 mb-4" />
            <SkeletonBox className="h-32 w-32 rounded-full" />
          </div>
          <div className="space-y-4">
            <SkeletonBox className="h-8 w-2/5 mb-4" />
            <SkeletonBox className="h-8 w-full" />
            <SkeletonBox className="h-8 w-full" />
            <SkeletonBox className="h-8 w-full" />
          </div>
        </div>
      </div>


      {/* Chart Skeleton */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <SkeletonBox className="h-7 w-3/5" />
          <SkeletonBox className="h-9 w-32" />
        </div>
        <SkeletonBox className="h-96" />
      </div>

      {/* Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-16 w-full" />
          <SkeletonBox className="h-16 w-full" />
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-40 w-full" />
        </div>
      </div>

      {/* Raw Data Skeleton */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
