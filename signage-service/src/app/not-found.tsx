import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F1E8] px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#B8643E] mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-[#6C5B50] mb-6">Page Not Found</h2>
            <p className="text-[#72665D] mb-8 max-w-md mx-auto">
              The resource you are looking for might have been moved, removed, or is temporarily unavailable.
            </p>
            <Link
              href="/"
              className="inline-flex px-8 py-3 bg-[#B8643E] text-white rounded-full font-medium hover:bg-[#A65835] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
