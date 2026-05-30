import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="py-section">
      <Container>
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-heading text-display text-neutral-900">404</h1>
          <h2 className="mt-2 text-h3 font-semibold text-neutral-700">Page Not Found</h2>
          <p className="mt-3 text-neutral-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button as="router-link" to={ROUTES.HOME} className="mt-8">
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
