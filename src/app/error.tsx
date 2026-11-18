"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center pt-16">
      <div className="wrap">
        <p className="type-code text-cobalt-bright">Error</p>
        <h1 className="type-h2 mt-4 max-w-[20ch] text-fg">Something on this page failed to load.</h1>
        <p className="type-lead mt-6 max-w-[32rem]">
          Try again. If it keeps happening, reload the page or come back in a few minutes.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-10 inline-flex h-12 items-center gap-2 rounded-lg bg-cobalt px-6 font-medium text-white transition-[transform,background-color] duration-200 ease-out hover:bg-[#3a70ff] active:scale-[0.97]"
        >
          <RotateCcw aria-hidden className="size-4" />
          Try again
        </button>
      </div>
    </section>
  );
}
