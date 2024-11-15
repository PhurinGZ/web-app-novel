// components/404.tsx
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import alertCircleOutline from '@iconify/icons-mdi/alert-circle-outline';

const NotFound404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Icon icon={alertCircleOutline} className="text-6xl text-red-500 mb-4" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
      <Link href="/" passHref>
        <Button color="primary">
          Go back home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound404;
