type ServiceStampProps = {
  className?: string;
  idPrefix?: string;
};

export default function ServiceStamp({
  className = '',
  idPrefix = 'service-stamp',
}: ServiceStampProps) {
  const textPathId = `${idPrefix}-text-path`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{
        filter:
          'drop-shadow(1px 1px 0px rgba(255,255,255,1)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.45))',
      }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />

      <path id={textPathId} d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
      <text className="text-[8.5px] font-black uppercase" fill="rgba(14,26,43,0.35)">
        <textPath href={`#${textPathId}`} startOffset="0%" textLength="210" lengthAdjust="spacing">
          • PRÜFUNG • REPARATUR • SERVICE
        </textPath>
      </text>

      <g transform="translate(36, 36) scale(1.15)">
        <path
          stroke="rgba(14,26,43,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </g>
    </svg>
  );
}
