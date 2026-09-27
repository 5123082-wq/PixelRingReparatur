'use client';

import { useId, useState } from 'react';
import type { LedVisualCopy } from '@/lib/content/led-modernization';
import styles from './LeistungenLedPage.module.css';

type DiagramCopy = Pick<LedVisualCopy, 'stages' | 'stageTitles' | 'stageTexts' | 'layers' | 'sign' | 'demoNote'>;

export default function LeistungenLedLightbox({ copy }: { copy: DiagramCopy }) {
  const [stage, setStage] = useState(1);
  const [animate, setAnimate] = useState(true);
  const id = useId().replace(/:/g, '');
  return (
    <div className={styles.lightbox}>
      <div className={styles.diagramControls} role="group" aria-label={copy.stages.join(' / ')}>
        {copy.stages.map((label, index) => (
          <button key={label} type="button" aria-pressed={stage === index} aria-controls={`${id}-description`} onClick={(event) => { setAnimate(event.detail !== 0); setStage(index); }}>
            <span aria-hidden="true">0{index + 1}</span>{label}
          </button>
        ))}
      </div>
      <div className={styles.diagramLayout}>
        <div className={styles.diagramCanvas} data-stage={stage} data-motion={animate ? 'on' : 'off'}>
          <svg viewBox="0 0 760 470" aria-hidden="true" focusable="false" className={styles.diagram}>
            <defs>
              <linearGradient id={`${id}-metal`} x2="0.8" y2="1"><stop stopColor="#607278"/><stop offset="1" stopColor="#26383e"/></linearGradient>
              <linearGradient id={`${id}-face`} x2="0" y2="1"><stop stopColor="#fffefa"/><stop offset="1" stopColor="#dce4ec"/></linearGradient>
              <radialGradient id={`${id}-halo`}><stop stopColor="#b4c6dc" stopOpacity=".22"/><stop offset="1" stopColor="#b4c6dc" stopOpacity="0"/></radialGradient>
              <pattern id={`${id}-grid`} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M 36 0 L 0 0 0 36" fill="none" stroke="#b4c6cb" strokeOpacity=".07"/></pattern>
            </defs>
            <path fill={`url(#${id}-grid)`} d="M0 0h760v470H0z"/>
            <ellipse cx="380" cy="275" rx="355" ry="195" fill={`url(#${id}-halo)`}/>
            <g className={styles.housing}>
              <path d="M130 162 583 125 654 168 197 210Z" fill="#72838a"/>
              <path d="M583 125 654 168 654 348 583 305Z" fill="#202f35" stroke="#7b8b91"/>
              <path d="M130 162 583 125 583 305 130 342Z" fill={`url(#${id}-metal)`} stroke="#819398" strokeWidth="2"/>
              <path d="M143 175 570 141 570 291 143 327Z" fill="#14283d" stroke="#93a4a7" strokeOpacity=".4"/>
              <path d="M130 342 197 384 654 348 583 305Z" fill="#4d6068"/>
              <path d="M130 162 197 210 197 384 130 342Z" fill="#354951" stroke="#819398"/>
              {[165, 548].map(x => <g key={x} fill="#92a1a4"><circle cx={x} cy={x === 165 ? 190 : 157} r="3"/><circle cx={x} cy={x === 165 ? 310 : 278} r="3"/></g>)}
            </g>
            <g className={styles.tubes}>
              {[0, 1, 2].map(row => <g key={row} transform={`translate(0 ${row * 44})`}>
                <path d="M178 203 545 173" stroke="#ddc997" strokeOpacity=".18" strokeWidth="18"/>
                <path d="M178 203 545 173" stroke={row === 1 ? '#7b7968' : '#ecdfb6'} strokeWidth="9" strokeLinecap="round"/>
                <path d="M173 203 184 202 M540 173 550 172" stroke="#a8b5b5" strokeWidth="15"/>
              </g>)}
            </g>
            <g className={styles.modules}>
              {[0, 1, 2].map(row => <g key={row} transform={`translate(0 ${row * 44})`}>
                <path d="M180 203 540 173" fill="none" stroke="#adbfbc" strokeWidth="1.5"/>
                {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${180 + i * 51} ${203 - i * 4.2}) rotate(-5)`}>
                  <rect x="-15" y="-8" width="30" height="16" rx="4" fill="#d6e1de"/>
                  <ellipse rx="24" ry="17" fill="#f1ffe8" opacity=".1"/>
                  <circle cx="-7" r="3.5" fill="#fffef1"/><circle cx="7" r="3.5" fill="#fffef1"/>
                </g>)}
              </g>)}
              <path d="M537 172 553 171 553 290 452 297" stroke="#96b0a7" strokeWidth="2" fill="none"/>
              <rect x="392" y="290" width="60" height="19" rx="3" fill="#b4c4c0" transform="rotate(-5 392 290)"/>
              <path d="M405 295h30m-30 4h22" stroke="#5d7371" strokeWidth="2"/>
            </g>
            <g className={styles.closedShell}>
              <path d="M130 162 583 125 654 168 197 210Z" fill="#53696e" stroke="#819398"/>
              <path d="M130 162 197 210 197 390 130 342Z" fill="#354951" stroke="#819398"/>
            </g>
            <g className={styles.front}>
              <path d="M197 210 654 168 654 348 197 390Z" fill={`url(#${id}-face)`} stroke="#f8fafc" strokeWidth="2"/>
              <path d="M197 390 205 397 662 355 654 348Z" fill="#94a8a7"/>
              <path d="M654 168 662 175 662 355 654 348Z" fill="#c3d4cf"/>
              <text x="425" y="292" textAnchor="middle" fill="#0e1a2b" fontSize="36" fontWeight="800" transform="rotate(-5 425 292)">{copy.sign}</text>
            </g>
            <g fill="#bac8d8" fontFamily="monospace" fontSize="12">
              <path d="M137 155 103 104H72" fill="none" stroke="#aebed0" strokeOpacity=".6"/><text x="49" y="108">01</text>
              <path d="M421 176 456 70H516" fill="none" stroke="#aebed0" strokeOpacity=".6"/><text x="529" y="74">02</text>
              <path d="M625 356 657 415H688" fill="none" stroke="#aebed0" strokeOpacity=".6"/><text x="697" y="419">03</text>
            </g>
          </svg>
          <p className={styles.diagramNote}>{copy.demoNote}</p>
        </div>
        <div className={styles.diagramDescription} id={`${id}-description`} aria-live="polite" aria-atomic="true">
          <span className={styles.chapter} dir="ltr">0{stage + 1} / 03</span>
          <h3>{copy.stageTitles[stage]}</h3>
          <p>{copy.stageTexts[stage]}</p>
          <ol>{copy.layers.map((layer, i) => <li key={layer} data-active={i === stage}><span>0{i + 1}</span>{layer}</li>)}</ol>
        </div>
      </div>
    </div>
  );
}
