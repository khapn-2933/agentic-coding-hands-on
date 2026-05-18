import Image from "next/image";
import Link from "next/link";

export default function SunKudosBlock() {
  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36 overflow-hidden">
      <div className="mx-auto max-w-[1224px]">
        <div className="relative overflow-hidden rounded-[16px] bg-[#0F0F0F] min-h-[500px] flex">
          {/* Right-side Sun* + KUDOS branded wordmark */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center justify-end pr-16 z-[1]">
            <Image
              src="/kudos-wordmark.png"
              alt=""
              width={420}
              height={86}
              className="h-auto w-[280px] xl:w-[420px] opacity-95"
            />
          </div>

          {/* Text content on the left */}
          <div className="relative z-10 flex flex-col justify-center gap-8 p-8 md:p-12 lg:py-16 lg:pl-24 max-w-[520px]">
            <p className="text-2xl font-bold leading-[32px] text-white">
              Phong trào ghi nhận
            </p>

            <h2
              className="text-4xl md:text-[57px] md:leading-[64px] font-bold text-[#FFEA9E]"
              style={{ letterSpacing: "-0.25px" }}
            >
              Sun* Kudos
            </h2>

            <p
              className="text-base font-bold text-white"
              style={{ lineHeight: "24px", letterSpacing: "0.5px" }}
            >
              <span className="block uppercase">Điểm mới của SAA 2025</span>
              Hoạt động ghi nhận và cảm ơn đồng nghiệp – lần đầu tiên được diễn ra
              dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025,
              khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp
              trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads
              tham khảo trong quá trình lựa chọn người đạt giải.
            </p>

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
