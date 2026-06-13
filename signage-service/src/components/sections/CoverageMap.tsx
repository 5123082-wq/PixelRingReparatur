'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CoverageMapCmsContent } from '@/lib/cms/pages';

interface CoverageMapProps {
  content?: CoverageMapCmsContent;
}

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  isHQ?: boolean;
}

interface RouteParticle {
  id: string;
  routeIndex: number;
  particleIndex: number;
  x: number;
  y: number;
  z: number;
  size: number;
  shadowSize: number;
  opacity: number;
}

// Custom Brand-Styled Icons (Sized down by ~30%)
const NationwideIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#C86E4A" strokeWidth="1.5"/>
    <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22" stroke="#C86E4A" strokeWidth="1.5"/>
    <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22" stroke="#C86E4A" strokeWidth="1.5"/>
    <path d="M2 12H22" stroke="#C86E4A" strokeWidth="1.5"/>
  </svg>
);

const ExpressIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#C86E4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GuaranteedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#C86E4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#C86E4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpertsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" stroke="#C86E4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const featureIcons: Record<string, React.ReactNode> = {
  nationwide: <NationwideIcon />,
  express: <ExpressIcon />,
  guaranteed: <GuaranteedIcon />,
  experts: <ExpertsIcon />,
};

// Higher fidelity Germany outline
const GERMANY_PATH = "M46.7,5.5 L47.8,0.5 L55.3,1.3 L58.3,14.6 L66.8,15.6 L72.3,17.2 L74.3,21.8 L81.8,24.8 L83.8,20.5 L86.8,21.5 L89.8,27.3 L92.8,29.8 L94.3,37.3 L99.3,42.8 L97.3,48.3 L95.8,55.3 L92.8,58.8 L88.8,59.3 L83.8,65.3 L81.8,72.3 L78.8,73.8 L77.8,80.3 L72.8,82.8 L73.3,87.8 L68.3,92.3 L58.8,92.8 L53.8,97.3 L45.3,99.3 L40.8,93.8 L33.8,91.8 L30.3,92.8 L28.8,87.8 L24.8,82.8 L18.8,80.3 L10.8,81.3 L6.8,75.3 L7.8,69.8 L3.8,65.8 L1.3,61.8 L2.8,55.8 L0.3,51.8 L3.8,47.8 L1.3,42.8 L3.3,37.8 L6.3,34.8 L6.8,28.8 L9.8,22.8 L15.8,19.3 L22.8,20.3 L25.8,13.8 L33.8,14.3 L38.3,10.3 Z";

const isPointInPolygon = (x: number, y: number, polygon: [number, number][]) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const cities: City[] = [
  { id: 'berlin', name: 'Berlin', x: 74, y: 35, isHQ: true },
  { id: 'hamburg', name: 'Hamburg', x: 38, y: 20 },
  { id: 'munich', name: 'München', x: 65, y: 85 },
  { id: 'cologne', name: 'Köln', x: 15, y: 52 },
  { id: 'frankfurt', name: 'Frankfurt am Main', x: 32, y: 64 },
  { id: 'stuttgart', name: 'Stuttgart', x: 34, y: 82 },
  { id: 'leipzig', name: 'Leipzig', x: 66, y: 48 },
  { id: 'nuremberg', name: 'Nürnberg', x: 58, y: 72 },
];

const ROUTE_PARTICLE_COUNT = 56;
const ROUTE_PARTICLE_START_DELAY = 0.85;
const ROUTE_PARTICLE_DELAY_STEP = 0.012;
const ROUTE_DELAY_STEP = 0.1;
const CITY_NODE_RADIUS = 0.8;
const CITY_NODE_EXPANDED_RADIUS = CITY_NODE_RADIUS * 1.5;

function getRouteArrivalDelay(routeIndex: number) {
  return ROUTE_PARTICLE_START_DELAY + routeIndex * ROUTE_DELAY_STEP + (ROUTE_PARTICLE_COUNT - 1) * ROUTE_PARTICLE_DELAY_STEP + 0.2;
}

function buildRouteParticles(hq: City, city: City, routeIndex: number): RouteParticle[] {
  const dx = city.x - hq.x;
  const dy = city.y - hq.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (!distance) {
    return [];
  }

  const bridgeHeight = Math.min(Math.max(distance * 1.55, 34), 112);

  return Array.from({ length: ROUTE_PARTICLE_COUNT }, (_, particleIndex) => {
    const progress = particleIndex / (ROUTE_PARTICLE_COUNT - 1);
    const z = Math.sin(Math.PI * progress) * bridgeHeight;
    const liftFade = Math.sin(Math.PI * progress);
    const size = 8.5 - progress * 4.6;

    return {
      id: `${city.id}-${particleIndex}`,
      routeIndex,
      particleIndex,
      x: hq.x + dx * progress,
      y: hq.y + dy * progress,
      z,
      size,
      shadowSize: size * (1.15 + liftFade * 0.75),
      opacity: 0.46 + (1 - progress) * 0.22 + liftFade * 0.14,
    };
  });
}

const CoverageMap = ({ content }: CoverageMapProps) => {
  const t = useTranslations('Coverage');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  // Static isometric angle (final settled pose from previous scroll-based motion)
  const rotateX = 64;
  const rotateZ = -18;
  const rotateXInverse = -64;
  const rotateZInverse = 18;
  const hq = cities.find(c => c.isHQ)!;
  const routeParticles = cities
    .filter(c => !c.isHQ)
    .flatMap((city, routeIndex) => buildRouteParticles(hq, city, routeIndex));

  // ULTRA PERFORMANCE: Single Path rendering logic
  const { mainMatrixPath } = useMemo(() => {
    const polygon: [number, number][] = GERMANY_PATH
      .replace(/[MLZ]/g, '')
      .split(' ')
      .filter(p => p.trim())
      .map(p => p.split(',').map(Number) as [number, number]);

    const cols = 62; 
    const rows = 75;
    let mainD = "";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / cols) * 100;
        const y = (r / rows) * 100;
        if (isPointInPolygon(x, y, polygon)) {
          // Drawing a "dot" using M and a very short h command with round line-caps
          mainD += `M${x.toFixed(1)} ${y.toFixed(1)}h0.01 `;
        }
      }
    }
    return {
      mainMatrixPath: mainD
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[85vh] min-h-[640px] max-h-[880px] bg-[#FFFDF9] overflow-hidden select-none border-y border-[#0E1A2B05]"
      style={{ perspective: "2500px" }}
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] bg-[#C86E4A05] rounded-full blur-[180px] pointer-events-none" />

      {/* OVERLAY: Floating Title Card (Top Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 left-6 md:top-12 md:left-14 z-20 w-[calc(100%-48px)] md:w-auto md:max-w-[380px]"
      >
        <div className="p-6 md:p-9 bg-gradient-to-br from-white/30 via-[#F7F1E8]/44 to-[#F7F1E8]/58 rounded-[28px] md:rounded-[44px] shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_16px_32px_rgba(0,0,0,0.02)] flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[30px] md:text-[42px] font-bold text-[#0E1A2B] leading-[1.05] tracking-tight">
              {content?.title || ''}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* OVERLAY: Floating Features (Bottom) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-14 md:right-14 z-20"
      >
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 md:gap-6 p-5 md:p-6 bg-gradient-to-br from-white/30 via-[#F7F1E8]/44 to-[#F7F1E8]/58 rounded-[32px] md:rounded-[40px] shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_12px_24px_rgba(0,0,0,0.02)]">
          {[
            { key: 'nationwide' },
            { key: 'express' },
            { key: 'guaranteed' },
            { key: 'experts' }
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3 md:gap-4 flex-1 min-w-[150px] group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-[14px] bg-white/[0.15] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/20">
                {featureIcons[item.key]}
              </div>
              <span className="text-[12px] md:text-[14px] font-bold text-[#0E1A2B] leading-tight flex-1 opacity-80">
                {t(`features.${item.key}`)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3D MAP SCENE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={false}
          style={{ 
            rotateX, 
            rotateZ,
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
          className="relative w-[85%] max-w-[1000px] aspect-square flex items-center justify-center"
        >
          {/* Floor Shadow */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[#0E1A2B03] blur-[100px] translate-y-24 -translate-z-[100px] scale-x-[1.3] scale-y-[0.7] rounded-full pointer-events-none" />

          <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            {/* Main Matrix Surface */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full drop-shadow-[0_4px_12px_rgba(14,26,43,0.03)] overflow-visible translate-z-0"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d={mainMatrixPath}
                stroke="#0E1A2B"
                strokeWidth="0.85"
                strokeLinecap="round"
                strokeOpacity={0.25}
              />

              {/* Nodes */}
              {cities.map((city, idx) => (
                <motion.g
                  key={`node-perf-${city.id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.2 + idx * 0.08, duration: 0.6 }}
                >
                  {city.isHQ ? (
                    <circle cx={city.x} cy={city.y} r="1.3" fill="#C86E4A" />
                  ) : (
                    <motion.circle
                      data-city-node="true"
                      cx={city.x}
                      cy={city.y}
                      r={CITY_NODE_RADIUS}
                      fill="#0E1A2B"
                      animate={isInView ? { r: CITY_NODE_EXPANDED_RADIUS } : {}}
                      transition={{
                        delay: getRouteArrivalDelay(cities.filter(c => !c.isHQ).findIndex(c => c.id === city.id)),
                        duration: 0.45,
                        ease: "easeOut"
                      }}
                    />
                  )}
                  {city.isHQ && (
                    <motion.circle
                      cx={city.x}
                      cy={city.y}
                      r="4"
                      fill="#C86E4A"
                      fillOpacity="0.15"
                      animate={{ r: [3, 5, 3], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              ))}
            </svg>

            {/* 3D Pixel Streams */}
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              {isInView && routeParticles.map((particle) => (
                <React.Fragment key={particle.id}>
                  <motion.span
                    data-route-shadow="true"
                    className="absolute block rounded-full bg-[#0E1A2B]/10 blur-[1.5px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.08 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.7 + particle.routeIndex * ROUTE_DELAY_STEP + particle.particleIndex * 0.01,
                      ease: "easeOut"
                    }}
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.shadowSize}px`,
                      height: `${particle.shadowSize * 0.68}px`,
                      transform: "translate3d(-50%, -50%, 1px)",
                    }}
                  />
                  <motion.span
                    data-route-pixel="true"
                    className="absolute block rounded-full bg-gradient-to-br from-[#E7B792] via-[#C86E4A] to-[#9E4F34] shadow-[0_0_12px_rgba(200,110,74,0.32)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: particle.opacity }}
                    transition={{
                      duration: 0.45,
                      delay: ROUTE_PARTICLE_START_DELAY + particle.routeIndex * ROUTE_DELAY_STEP + particle.particleIndex * ROUTE_PARTICLE_DELAY_STEP,
                      ease: "easeOut"
                    }}
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      transform: `translate3d(-50%, -50%, ${particle.z}px)`,
                    }}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
            {cities.map((city) => (
              <motion.div
                key={`label-perf-${city.id}`}
                className="absolute pointer-events-none"
                initial={false}
                style={{ 
                  left: `${city.x}%`, 
                  top: `${city.y}%`,
                  rotateX: rotateXInverse,
                  rotateZ: rotateZInverse,
                  translateZ: "30px",
                  x: "-50%",
                  y: "-180%",
                  transformStyle: "preserve-3d",
                  willChange: "transform"
                }}
              >
                <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                  <span 
                    className={`text-[11px] md:text-[12px] font-bold drop-shadow-sm ${city.isHQ ? 'text-[#0E1A2B]' : 'text-[#0E1A2BB0]'}`}
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      background: 'rgba(255, 255, 255, 0.35)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backdropFilter: 'blur(3px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {city.name}
                  </span>
                  {city.isHQ && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#C86E4A]">HQ</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoverageMap;
