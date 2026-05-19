import Image from "next/image";
import { getEventStartAt } from "@/lib/event-config";
import PrelaunchCountdown from "./prelaunch-countdown";

export default function CountdownPrelaunchPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#00101A]">
      {/* Keyvisual bg — tree art on the right, dark fade on the left. */}
      <Image
        src="/homepage-keyvisual.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* Cover gradient per Figma node 2268:35130: 18deg dark fade. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0) 63.41%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-18 lg:px-36 py-24">
        <PrelaunchCountdown eventStartAt={getEventStartAt()} />
      </div>
    </main>
  );
}
