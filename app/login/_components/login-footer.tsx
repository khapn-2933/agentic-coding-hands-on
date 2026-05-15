export default function LoginFooter() {
  return (
    <footer
      className="relative z-20 flex items-center justify-center"
      style={{
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
    >
      <p
        className="text-white text-center"
        style={{
          fontFamily: "var(--font-montserrat-alt), sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
        }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
