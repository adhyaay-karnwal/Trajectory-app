'use client';

import { ReactNode, useState } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
  );
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
