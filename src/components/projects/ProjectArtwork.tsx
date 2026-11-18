import type { ProjectArtwork as ArtworkKind } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * Abstract artwork for project slots without a real image yet. Drawn in code
 * from the brand's own forms (plates, nodes, flows), so nothing here imitates
 * a real product or client.
 */
export function ProjectArtwork({ kind, className }: { kind: ArtworkKind; className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-[#070b12]", className)}>
      <div className="blueprint absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,rgba(43,99,245,0.22),transparent_70%)]" />
      {kind === "layers" ? <Layers /> : null}
      {kind === "network" ? <Network /> : null}
      {kind === "flow" ? <Flow /> : null}
      {kind === "terminal" ? <Terminal /> : null}
    </div>
  );
}

function Layers() {
  return (
    <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
      <div className="relative h-[60%] w-[46%] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-36deg)]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl border border-white/20"
            style={{
              transform: `translateZ(${(1.5 - i) * 46}px)`,
              background:
                i === 0
                  ? "linear-gradient(140deg, rgba(155,186,255,0.38), rgba(43,99,245,0.14) 60%)"
                  : "linear-gradient(140deg, rgba(155,186,255,0.14), rgba(13,20,30,0.85) 50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Network() {
  const nodes: Array<[number, number]> = [
    [20, 30], [42, 18], [64, 34], [80, 22], [30, 62], [52, 52], [74, 66], [46, 82],
  ];
  const links: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [4, 7], [7, 6], [1, 5],
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {links.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="rgb(155 186 255 / 0.35)"
          strokeWidth={0.25}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 2.2 : 1.2} fill={i === 5 ? "#6f9dff" : "#c4ccd8"} />
      ))}
    </svg>
  );
}

function Flow() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[8%]">
      <div className="flex w-full max-w-[34rem] items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "aspect-[4/3] flex-1 rounded-lg border",
                i < 2 ? "border-mint/40 bg-mint/[0.07]" : i === 2 ? "border-cobalt-bright/60 bg-cobalt/20" : "border-white/15 bg-white/[0.04]",
              )}
            />
            {i < 3 ? <div className="h-px w-3 bg-white/30" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Terminal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[10%]">
      <div className="w-full max-w-[24rem] rounded-xl border border-white/15 bg-[#0b111a]/90 p-4">
        <div className="mb-3 flex gap-1.5">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
        </div>
        {[72, 54, 86, 40, 64].map((w, i) => (
          <div key={i} className="mt-2 flex items-center gap-2">
            <span className={cn("h-1.5 w-3 rounded-sm", i === 2 ? "bg-mint/70" : "bg-cobalt-bright/60")} />
            <span className="h-1.5 rounded-sm bg-white/15" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
