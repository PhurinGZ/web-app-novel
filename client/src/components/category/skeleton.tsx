// components/Skeleton.tsx
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      {...props}
    />
  );
};

export default Skeleton;