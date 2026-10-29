"use client";

import { Icon } from "./Icon";

export function GreetingBox() {
  return (
    <section
      aria-label="Greeting"
      className="flex items-center gap-3 rounded-lg border border-[#e6e9e1] bg-[#e7eddf] px-6 py-4 mb-6"
    >
      <span className="text-[#356e54]">
        <Icon name="leaf" size={20} />
      </span>
      <h2 className="text-[#263832] text-lg font-semibold leading-snug">
        Hi Anupam, Good Morning!
      </h2>
    </section>
  );
}
