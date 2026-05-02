import React from 'react';

// This is the root layout that wraps all routes.
// In our localized setup, the actual <html> and <body> tags
// are handled by src/app/[locale]/layout.tsx to support dynamic
// lang and dir attributes.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
