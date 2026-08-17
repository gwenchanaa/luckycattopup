import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { GameBrowser } from "@/components/GameBrowser";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeatureSection />
      <section id="games" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Game Populer</h2>
          <p className="mt-2 text-muted-foreground">Pilih game yang mau kamu top up</p>
        </div>
        <GameBrowser />
      </section>
    </div>
  );
}
