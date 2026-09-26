import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { LuckyCoinBar } from "@/components/LuckyCoinBar";
import { FeatureSection } from "@/components/FeatureSection";
import { GameBrowser } from "@/components/GameBrowser";
import { GameGridSkeleton } from "@/components/GameGrid";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LuckyCoinBar />

      <section id="games" className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-display text-[26px] font-extrabold leading-none text-ink">
            Paling sering di-top up
          </h2>
          <span className="text-[12.5px] font-medium text-[#9c8c84]">Popular this week</span>
        </div>

        <Suspense fallback={<GameGridSkeleton />}>
          <GameBrowser />
        </Suspense>
      </section>

      <FeatureSection />
    </div>
  );
}
