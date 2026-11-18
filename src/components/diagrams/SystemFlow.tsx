/**
 * About-section illustration: the everyday inputs of a business flowing into
 * a system Tredrox builds, and the work that comes out the other side.
 *
 * Motion is SVG (SMIL): glowing packets travel each route; a source flashes
 * as it sends, the core's layers light in turn, and an output flashes as a
 * packet arrives. Everything on one route shares its duration and start, so
 * the flashes stay in step. InView pauses it off screen and under reduced
 * motion. Two drawings: horizontal from 640px, vertical below (legible text).
 */

const inputs = ["Emails", "Documents", "CRM records", "Payments"];
const outputs = ["Answers", "Actions taken", "Reports"];
const layers = ["Agents", "APIs", "Data"];

const DUR = 2.8; // seconds a packet takes along one route
const DIM = "rgba(237,242,247,0.14)";
const LIT = "rgba(125,165,255,0.95)";

type Route = { id: string; d: string; begin: number };

function Defs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <radialGradient id={`${prefix}-core-glow`} cx="50%" cy="50%" r="60%">
        <stop offset="0" stopColor="rgba(43,99,245,0.34)" />
        <stop offset="1" stopColor="rgba(43,99,245,0)" />
      </radialGradient>
      <radialGradient id={`${prefix}-packet`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="rgba(190,212,255,1)" />
        <stop offset="0.35" stopColor="rgba(111,157,255,0.75)" />
        <stop offset="1" stopColor="rgba(43,99,245,0)" />
      </radialGradient>
      <linearGradient id={`${prefix}-node`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#131c2a" />
        <stop offset="1" stopColor="#0b111a" />
      </linearGradient>
    </defs>
  );
}

function RouteLine({ route, prefix }: { route: Route; prefix: string }) {
  const id = `${prefix}-${route.id}`;
  return (
    <g>
      <path d={route.d} fill="none" stroke="rgba(43,99,245,0.12)" strokeWidth={7} strokeLinecap="round" />
      <path id={id} d={route.d} fill="none" stroke="rgba(111,157,255,0.34)" strokeWidth={1.4} strokeLinecap="round" />
      {/* Hidden until its first run begins, so a delayed packet never waits at the origin. */}
      <g opacity={0}>
        <circle r={9} fill={`url(#${prefix}-packet)`} />
        <circle r={2.6} fill="#e6eeff" />
        <animateMotion dur={`${DUR}s`} begin={`${route.begin}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.25 1">
          <mpath href={`#${id}`} />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.12;0.86;1"
          dur={`${DUR}s`}
          begin={`${route.begin}s`}
          repeatCount="indefinite"
        />
      </g>
    </g>
  );
}

/** A node that flashes when its packet leaves (send) or arrives (receive). */
function Node({
  x,
  y,
  w,
  label,
  live,
  prefix,
  flash,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  live?: boolean;
  prefix: string;
  flash?: { begin: number; at: "send" | "receive" };
}) {
  const keyTimes = flash?.at === "send" ? "0;0.06;0.3;1" : "0;0.84;0.93;1";
  const values = flash?.at === "send" ? `${LIT};${LIT};${DIM};${DIM}` : `${DIM};${DIM};${LIT};${DIM}`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={10} fill={`url(#${prefix}-node)`} stroke={DIM}>
        {flash ? (
          <animate
            attributeName="stroke"
            values={values}
            keyTimes={keyTimes}
            dur={`${DUR}s`}
            begin={`${flash.begin}s`}
            repeatCount="indefinite"
          />
        ) : null}
      </rect>
      <line x1={x + 12} x2={x + w - 12} y1={y + 0.5} y2={y + 0.5} stroke="rgba(255,255,255,0.06)" />
      <circle cx={x + 18} cy={y + 20} r={3.5} fill={live ? "#5ef2c0" : "#6f9dff"} />
      <text x={x + 32} y={y + 25} fill="#c4ccd8" fontSize={13} fontWeight={500}>
        {label}
      </text>
    </g>
  );
}

function Core({ x, y, w, h, prefix }: { x: number; y: number; w: number; h: number; prefix: string }) {
  const barH = 28;
  const gap = 9;
  const top = y + 64;
  const cycle = 3.6;
  return (
    <g>
      <rect x={x - 22} y={y - 22} width={w + 44} height={h + 44} rx={28} fill={`url(#${prefix}-core-glow)`}>
        <animate attributeName="opacity" values="0.75;1;0.75" dur="3.6s" repeatCount="indefinite" />
      </rect>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={`url(#${prefix}-node)`} stroke="rgba(111,157,255,0.6)" />
      <line x1={x + 16} x2={x + w - 16} y1={y + 0.5} y2={y + 0.5} stroke="rgba(190,212,255,0.3)" />
      <text x={x + 16} y={y + 27} fill="#edf2f7" fontSize={13} fontWeight={600}>
        Your system
      </text>
      <text x={x + 16} y={y + 44} fill="#8b95a7" fontSize={11}>
        built by Tredrox
      </text>
      {layers.map((layer, i) => (
        <g key={layer}>
          <rect
            x={x + 14}
            y={top + i * (barH + gap)}
            width={w - 28}
            height={barH}
            rx={7}
            fill="rgba(237,242,247,0.04)"
            stroke="rgba(237,242,247,0.1)"
          >
            <animate
              attributeName="fill"
              values="rgba(237,242,247,0.04);rgba(43,99,245,0.34);rgba(237,242,247,0.04);rgba(237,242,247,0.04)"
              keyTimes="0;0.12;0.33;1"
              dur={`${cycle}s`}
              begin={`${i * (cycle / 3)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="rgba(237,242,247,0.1);rgba(125,165,255,0.75);rgba(237,242,247,0.1);rgba(237,242,247,0.1)"
              keyTimes="0;0.12;0.33;1"
              dur={`${cycle}s`}
              begin={`${i * (cycle / 3)}s`}
              repeatCount="indefinite"
            />
          </rect>
          <text x={x + 28} y={top + i * (barH + gap) + 19} fill="#c4ccd8" fontSize={12}>
            {layer}
          </text>
        </g>
      ))}
    </g>
  );
}

const TITLE =
  "Emails, documents, CRM records and payments flow into a system built by Tredrox, made of agents, APIs and data, which produces answers, actions and reports.";

export function SystemFlowHorizontal() {
  const p = "flow-h";
  const inY = [48, 128, 208, 288];
  const outY = [88, 168, 248];
  const core = { x: 250, y: 92, w: 168, h: 196 };
  const inRoutes: Route[] = inY.map((y, i) => ({
    id: `in-${i}`,
    d: `M150 ${y + 20} C 200 ${y + 20}, 205 ${150 + i * 26}, ${core.x} ${150 + i * 26}`,
    begin: i * 0.7,
  }));
  const outRoutes: Route[] = outY.map((y, i) => ({
    id: `out-${i}`,
    d: `M${core.x + core.w} ${168 + i * 26} C ${core.x + core.w + 40} ${168 + i * 26}, 455 ${y + 20}, 500 ${y + 20}`,
    begin: 1.4 + i * 0.93,
  }));
  return (
    <svg data-animated viewBox="0 0 660 380" className="h-auto w-full" role="img" aria-labelledby={`${p}-title`}>
      <title id={`${p}-title`}>{TITLE}</title>
      <Defs prefix={p} />
      {[...inRoutes, ...outRoutes].map((route) => (
        <RouteLine key={route.id} route={route} prefix={p} />
      ))}
      {inputs.map((label, i) => (
        <Node key={label} x={12} y={inY[i]} w={138} label={label} prefix={p} flash={{ begin: inRoutes[i].begin, at: "send" }} />
      ))}
      <Core {...core} prefix={p} />
      {outputs.map((label, i) => (
        <Node
          key={label}
          x={500}
          y={outY[i]}
          w={148}
          label={label}
          live={i === 1}
          prefix={p}
          flash={{ begin: outRoutes[i].begin, at: "receive" }}
        />
      ))}
    </svg>
  );
}

export function SystemFlowVertical() {
  const p = "flow-v";
  const core = { x: 96, y: 168, w: 168, h: 196 };
  const inPos = [
    [14, 24],
    [186, 24],
    [14, 84],
    [186, 84],
  ] as const;
  const outPos = [
    [14, 424],
    [186, 424],
    [100, 484],
  ] as const;
  const inRoutes: Route[] = inPos.map(([x, y], i) => ({
    id: `in-${i}`,
    d: `M${x + 80} ${y + 40} C ${x + 80} ${y + 90}, ${150 + i * 20} 120, ${150 + i * 20} ${core.y}`,
    begin: i * 0.7,
  }));
  const outRoutes: Route[] = outPos.map(([x, y], i) => ({
    id: `out-${i}`,
    d: `M${160 + i * 20} ${core.y + core.h} C ${160 + i * 20} ${core.y + core.h + 30}, ${x + 80} ${y - 30}, ${x + 80} ${y}`,
    begin: 1.4 + i * 0.93,
  }));
  return (
    <svg data-animated viewBox="0 0 360 540" className="h-auto w-full" role="img" aria-labelledby={`${p}-title`}>
      <title id={`${p}-title`}>{TITLE}</title>
      <Defs prefix={p} />
      {[...inRoutes, ...outRoutes].map((route) => (
        <RouteLine key={route.id} route={route} prefix={p} />
      ))}
      {inputs.map((label, i) => (
        <Node
          key={label}
          x={inPos[i][0]}
          y={inPos[i][1]}
          w={160}
          label={label}
          prefix={p}
          flash={{ begin: inRoutes[i].begin, at: "send" }}
        />
      ))}
      <Core {...core} prefix={p} />
      {outputs.map((label, i) => (
        <Node
          key={label}
          x={outPos[i][0]}
          y={outPos[i][1]}
          w={160}
          label={label}
          live={i === 1}
          prefix={p}
          flash={{ begin: outRoutes[i].begin, at: "receive" }}
        />
      ))}
    </svg>
  );
}
