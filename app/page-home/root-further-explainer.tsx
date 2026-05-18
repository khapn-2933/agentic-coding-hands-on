export default function RootFurtherExplainer() {
  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Section heading with ROOT FURTHER image mark */}
        <h2
          className="text-3xl md:text-4xl font-bold uppercase"
          style={{ fontFamily: "var(--font-montserrat-alt), var(--font-montserrat), sans-serif" }}
        >
          ROOT FURTHER
        </h2>

        {/* Long Vietnamese explainer paragraph */}
        {/* TODO: Verify exact body text against Figma design strip 2 — text below adapted from design image */}
        <div className="text-base md:text-lg text-white/80 leading-relaxed space-y-4">
          <p>
            Trong hành trình không ngừng đổi mới của mình, Sun* đã và đang viết nên những chương sách về sự phát
            triển bền vững, về những con người với tầm nhìn xa rộng và tinh thần kiên trì. Mỗi năm qua, chúng tôi
            lại có thêm những lý do để tin rằng: nền móng vững chắc chính là nền tảng để vươn cao hơn, đi xa hơn.
          </p>
          <p>
            SAA 2025 — Sun* Annual Awards năm nay mang chủ đề &ldquo;ROOT FURTHER&rdquo; — Vững Rộng Sâu Hơn — như
            một tuyên ngôn về hành trình chúng ta đang đi. Không chỉ là những thành tích nổi bật hay kết quả ấn
            tượng, mà là sự biểu hiện của những giá trị cốt lõi: sự chuyên tâm, tính kiên trì, và khả năng đứng
            vững trước mọi biến động. Mỗi giải thưởng là một câu chuyện, mỗi người được vinh danh là một ngọn lửa
            nung chảy khát vọng của cả tổ chức.
          </p>
          <p>
            Hãy cùng nhau lan toả ngọn lửa ấy — để từng rễ cây trong chúng ta được vững chắc hơn, để từng tâm hồn
            trong tổ chức được nuôi dưỡng hơn, và để Sun* tiếp tục viết nên những chương sử thi của riêng mình.
          </p>
        </div>

        {/* Pull quote */}
        <blockquote className="border-l-4 border-[#FFEA9E] pl-6 py-2 mt-4">
          <p className="text-lg md:text-2xl font-semibold italic text-white leading-snug">
            &ldquo;A tree with deep roots fears no storm&rdquo;
          </p>
          <p className="mt-2 text-sm text-white/50">
            (Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh)
          </p>
        </blockquote>
      </div>
    </section>
  );
}
