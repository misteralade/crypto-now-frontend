import { createFileRoute, redirect } from '@tanstack/react-router';
import { ROUTES } from '../../util/constants.util.ts';

export const Route = createFileRoute('/dispute/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: ROUTES.DISPUTE_DETAILS,
      params: { id: params.id },
    });
  },
});
