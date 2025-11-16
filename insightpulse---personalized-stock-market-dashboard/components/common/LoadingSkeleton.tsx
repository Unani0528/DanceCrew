import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6" aria-label="Loading data...">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <SkeletonBox className="h-8 w-1/2" />
        <SkeletonBox className="h-5 w-1/4" />
      </div>

      {/* AI Advisor Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center">
            <SkeletonBox className="w-6 h-6 mr-4 rounded-full" />
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <SkeletonBox className="h-4 w-1/5" />
                    <SkeletonBox className="h-4 w-1/4" />
                </div>
                <SkeletonBox className="h-5 w-4/5" />
            </div>
        </div>
      </div>

      {/* Summary Panel Skeleton */}
       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <SkeletonBox className="h-7 w-3/5" />
          <SkeletonBox className="h-9 w-32" />
        </div>
        <SkeletonBox className="h-96" />
      </div>

      {/* Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-16 w-full" />
          <SkeletonBox className="h-16 w-full" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-40 w-full" />
        </div>
      </div>

      {/* Raw Data Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;