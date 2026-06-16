'use client';

import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react';
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
  labelOffsetX?: string;
  labelOffsetY?: string;
}

interface RouteStream {
  id: string;
  routeIndex: number;
  duration: number;
  delay: number;
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
  { id: 'bremen', name: 'Bremen', x: 30, y: 31, labelOffsetX: '-84%', labelOffsetY: '-110%' },
  { id: 'hannover', name: 'Hannover', x: 43, y: 40, labelOffsetX: '-16%', labelOffsetY: '-210%' },
  { id: 'duesseldorf', name: 'Düsseldorf', x: 18, y: 48, labelOffsetX: '-12%', labelOffsetY: '-225%' },
  { id: 'cologne', name: 'Köln', x: 15, y: 55, labelOffsetX: '-92%', labelOffsetY: '12%' },
  { id: 'frankfurt', name: 'Frankfurt am Main', x: 32, y: 64 },
  { id: 'stuttgart', name: 'Stuttgart', x: 34, y: 82 },
  { id: 'nuremberg', name: 'Nürnberg', x: 58, y: 72 },
  { id: 'munich', name: 'München', x: 65, y: 85 },
  { id: 'leipzig', name: 'Leipzig', x: 66, y: 48 },
  { id: 'dresden', name: 'Dresden', x: 77, y: 56 },
];

const ROUTE_STREAM_START_DELAY = 0.55;
const ROUTE_DELAY_STEP = 0.1;
const CITY_NODE_RADIUS = 0.52;
const CITY_NODE_RING_RADIUS = 1.2;

function getRouteArrivalDelay(routeIndex: number) {
  return ROUTE_STREAM_START_DELAY + routeIndex * ROUTE_DELAY_STEP + 0.95;
}

function buildRouteStream(hq: City, city: City, routeIndex: number): RouteStream {
  const dx = city.x - hq.x;
  const dy = city.y - hq.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return {
    id: city.id,
    routeIndex,
    duration: Math.min(Math.max(distance / 18, 2.35), 3.9),
    delay: ROUTE_STREAM_START_DELAY + routeIndex * ROUTE_DELAY_STEP,
  };
}

const CoverageMap = ({ content }: CoverageMapProps) => {
  const t = useTranslations('Coverage');
  const containerRef = useRef<HTMLDivElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const [routeOverlay, setRouteOverlay] = useState<{
    width: number;
    height: number;
    paths: Record<string, string>;
  }>({ width: 0, height: 0, paths: {} });
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  // Static isometric angle (final settled pose from previous scroll-based motion)
  const rotateX = 64;
  const mapRotateZ = -18;
  const cityRotateZ = -3;
  const rotateXInverse = -64;
  const cityRotateZInverse = 3;
  const hq = cities.find(c => c.isHQ)!;
  const routeStreams = cities
    .filter(c => !c.isHQ)
    .map((city, routeIndex) => buildRouteStream(hq, city, routeIndex));

  const updateRouteOverlay = useCallback(() => {
    const frame = mapFrameRef.current;
    if (!frame) return;

    const frameRect = frame.getBoundingClientRect();
    const hqAnchor = frame.querySelector<SVGGraphicsElement>('[data-city-anchor="berlin"]');
    if (!hqAnchor || frameRect.width === 0 || frameRect.height === 0) return;

    const centerInFrame = (element: SVGGraphicsElement) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - frameRect.left,
        y: rect.top + rect.height / 2 - frameRect.top,
      };
    };

    const start = centerInFrame(hqAnchor);
    const paths: Record<string, string> = {};

    cities.filter(c => !c.isHQ).forEach((city) => {
      const anchor = frame.querySelector<SVGGraphicsElement>(`[data-city-anchor="${city.id}"]`);
      if (!anchor) return;

      const end = centerInFrame(anchor);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const lift = Math.min(Math.max(distance * 0.18, 18), frameRect.height * 0.12);
      const apexX = start.x + dx * 0.5;
      const apexY = Math.min(start.y, end.y) - lift;
      const controlX = 2 * apexX - (start.x + end.x) * 0.5;
      const controlY = 2 * apexY - (start.y + end.y) * 0.5;

      paths[city.id] = [
        `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`,
        `Q ${controlX.toFixed(1)} ${controlY.toFixed(1)}`,
        `${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
      ].join(' ');
    });

    setRouteOverlay({
      width: frameRect.width,
      height: frameRect.height,
      paths,
    });
  }, []);

  useEffect(() => {
    let frameId = 0;
    let timeoutId = 0;

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateRouteOverlay);
    };

    scheduleUpdate();
    timeoutId = window.setTimeout(scheduleUpdate, 450);
    window.addEventListener('resize', scheduleUpdate);

    const frame = mapFrameRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && frame) {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(frame);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }, [updateRouteOverlay]);

  // ULTRA PERFORMANCE: Single Path rendering logic
  const { mainMatrixPath } = useMemo(() => {
    const polygon: [number, number][] = GERMANY_PATH
      .replace(/[MLZ]/g, '')
      .split(' ')
      .filter(p => p.trim())
      .map(p => p.split(',').map(Number) as [number, number]);

    const cols = 52; 
    const rows = 64;
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
            <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
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
        <div ref={mapFrameRef} className="relative w-[85%] max-w-[1000px] aspect-square">
          {routeOverlay.width > 0 && routeOverlay.height > 0 && (
            <svg
              viewBox={`0 0 ${routeOverlay.width} ${routeOverlay.height}`}
              className="absolute inset-0 z-20 h-full w-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Routes are drawn after measuring the CSS-rotated city nodes, so each arc is built in screen space. */}
              {routeStreams.map((route) => {
                const pathD = routeOverlay.paths[route.id];
                if (!pathD) return null;

                return (
                  <motion.path
                    key={`route-trail-${route.id}`}
                    d={pathD}
                    fill="none"
                    stroke="#C86E4A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeOpacity={0.34}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: route.delay,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
            </svg>
          )}

          <motion.div
            initial={false}
            style={{
              rotateX,
              rotateZ: mapRotateZ,
              transformStyle: "preserve-3d",
              willChange: "transform"
            }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            {/* Floor Shadow */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[#0E1A2B03] blur-[100px] translate-y-24 -translate-z-[100px] scale-x-[1.3] scale-y-[0.7] rounded-full pointer-events-none" />

            <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              {/* Main Matrix Surface */}
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full overflow-visible translate-z-0 drop-shadow-[0_4px_12px_rgba(14,26,43,0.03)]"
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
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            style={{
              rotateX,
              rotateZ: cityRotateZ,
              transformStyle: "preserve-3d",
              willChange: "transform"
            }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full overflow-visible translate-z-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Nodes */}
                {cities.map((city, idx) => (
                  <motion.g
                    key={`node-perf-${city.id}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.2 + idx * 0.08, duration: 0.6 }}
                  >
                    {city.isHQ ? (
                      <circle data-city-anchor={city.id} cx={city.x} cy={city.y} r="1.3" fill="#C86E4A" />
                    ) : (
                      <>
                        <circle
                          data-city-node="true"
                          data-city-anchor={city.id}
                          cx={city.x}
                          cy={city.y}
                          r={CITY_NODE_RADIUS}
                          fill="#0E1A2B"
                        />
                        <motion.circle
                          cx={city.x}
                          cy={city.y}
                          fill="transparent"
                          stroke="#C86E4A"
                          strokeWidth="0.22"
                          initial={{ opacity: 0, r: CITY_NODE_RADIUS }}
                          animate={isInView ? { opacity: 1, r: CITY_NODE_RING_RADIUS } : {}}
                          transition={{
                            delay: getRouteArrivalDelay(cities.filter(c => !c.isHQ).findIndex(c => c.id === city.id)),
                            duration: 0.45,
                            ease: "easeOut"
                          }}
                        />
                      </>
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
                      rotateZ: cityRotateZInverse,
                      translateZ: "30px",
                      x: city.labelOffsetX || "-50%",
                      y: city.labelOffsetY || "-180%",
                      transformStyle: "preserve-3d",
                      willChange: "transform"
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                      <span
                        className={`text-[7px] sm:text-[8px] md:text-[12px] font-bold drop-shadow-sm ${city.isHQ ? 'text-[#0E1A2B]' : 'text-[#0E1A2BB0]'}`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          background: 'rgba(255, 255, 255, 0.35)',
                          padding: '1px 4px',
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
