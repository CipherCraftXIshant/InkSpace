import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <Container size="narrow" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#737373] mb-3">
          Error 404
        </p>
        <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-[#121212] tracking-tighter mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] mb-3">
          The page has dissolved into thin air.
        </h2>
        <p className="text-sm sm:text-base text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
          The story or page you were looking for could not be found. It may have been archived, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button to="/" variant="primary" size="md" icon={ArrowLeft}>
            Back to Home
          </Button>
          <Button to="/explore" variant="secondary" size="md" icon={Compass}>
            Explore Articles
          </Button>
        </div>
      </Container>
    </div>
  );
}
