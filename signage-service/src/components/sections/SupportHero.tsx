'use client';

import React from 'react';

const SupportHero = () => {
  return (
    <section className="absolute inset-0 overflow-hidden pointer-events-none h-[500px]">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B8643E]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#4A90E2]/5 blur-[100px] rounded-full" />
      </div>
    </section>
  );
};


export default SupportHero;
