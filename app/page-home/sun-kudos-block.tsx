import Image from "next/image";
import Link from "next/link";

export default function SunKudosBlock() {
  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden min-h-[360px] flex flex-col md:flex-row">
          {/* Background artwork (right side) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/kudos-bg.png"
              alt=""
              fill
              className="object-cover object-right"
              sizes="100vw"
            />
            {/* Gradient overlay so left-side text is readable */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, #00101A 40%, rgba(0,16,26,0.6) 70%, transparent 100%)",
              }}
            />
          </div>

          {/* Text content */}
          <div className="relative z-10 flex flex-col justify-center gap-5 p-8 md:p-12 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Phong trào ghi nhận
            </p>

            {/* Sun* Kudos title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Sun* Kudos
            </h2>

            {/* Description */}
            {/* TODO: Verify exact Vietnamese text against Figma design strip 4 */}
            <p className="text-base text-white/70 leading-relaxed">
              Không chỉ đơn giản là những lời khen ngợi, Sun* Kudos là phong trào ghi nhận và lan toả năng lượng tích
              cực trong toàn tổ chức. Mỗi lời cảm ơn, mỗi sự ghi nhận — dù lớn hay nhỏ — đều có ý nghĩa trong hành
              trình xây dựng văn hoá làm việc nơi mọi đóng góp đều được trân trọng.
            </p>

            {/* CTA */}
            <Link
              href="/sun-kudos"
              className="self-start mt-2 px-8 py-3 rounded-full text-sm font-bold text-[#00101A] bg-[#FFEA9E] hover:bg-[#ffe47a] transition-colors"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
