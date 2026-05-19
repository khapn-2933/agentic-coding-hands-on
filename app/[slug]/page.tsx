import { notFound } from "next/navigation";
import Link from "next/link";

const KNOWN_STUBS = new Set([
  "sun-kudos",
  "profile",
  "admin",
  "about-saa",
  "tieu-chuan-chung",
]);

export default async function StubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!KNOWN_STUBS.has(slug)) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{slug}</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Coming soon</h1>
      <p className="max-w-md text-zinc-400">
        Trang này đang được xây. Vui lòng quay lại sau.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-[#FFEA9E] px-6 py-2 text-sm font-semibold text-[#1a1a2e] transition hover:shadow-[0_8px_24px_rgba(255,234,158,0.35)]"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
