import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-5">
        <div className="flex items-center gap-4">
          <Image
            src="/cat-face.png"
            alt=""
            width={34}
            height={34}
            className="size-[34px] rounded-full border-[1.5px] border-sakura bg-sakura object-cover"
          />
          <span className="font-display text-[13px] font-bold text-background">
            Lucky Cat Top Up
          </span>
        </div>
        <span className="text-[11.5px] text-background/55">
          Distributor resmi · PT Hoki Digital Nusantara
        </span>
        <div className="flex-1" />
        <span className="text-[11.5px] text-background/55">
          Syarat · Privasi · WhatsApp 0811-1900-福
        </span>
      </div>
    </footer>
  );
}
