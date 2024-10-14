// components/Loading.js
import { Spinner } from '@nextui-org/react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-lg text-gray-700 animate-pulse">Loading...</p>
    </div>
  );
};

export default Loading;
