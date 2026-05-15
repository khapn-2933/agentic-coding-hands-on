export default function KeyVisual() {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden">
      {/* Dark navy base */}
      <div className="absolute inset-0 bg-[#0a1428]" />

      {/* Cyan/teal flowing blob — top-right area */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          right: "-5%",
          width: "70%",
          height: "80%",
          background:
            "radial-gradient(ellipse 60% 70% at 60% 30%, rgba(0,200,200,0.55) 0%, rgba(0,140,160,0.35) 40%, transparent 75%)",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          filter: "blur(8px)",
          transform: "rotate(-15deg)",
        }}
      />

      {/* Orange/amber large blob — center-right */}
      <div
        className="absolute"
        style={{
          top: "15%",
          right: "5%",
          width: "65%",
          height: "75%",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(230,100,20,0.75) 0%, rgba(200,60,10,0.55) 40%, transparent 72%)",
          borderRadius: "45% 55% 35% 65% / 55% 45% 65% 35%",
          filter: "blur(6px)",
          transform: "rotate(10deg)",
        }}
      />

      {/* Red/dark-orange inner blob */}
      <div
        className="absolute"
        style={{
          top: "25%",
          right: "15%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(ellipse 60% 55% at 45% 55%, rgba(180,30,10,0.65) 0%, rgba(150,20,5,0.45) 50%, transparent 75%)",
          borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
          filter: "blur(4px)",
          transform: "rotate(-5deg)",
        }}
      />

      {/* Bright cyan highlight — upper right accent */}
      <div
        className="absolute"
        style={{
          top: "5%",
          right: "10%",
          width: "35%",
          height: "40%",
          background:
            "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(0,230,220,0.45) 0%, rgba(0,180,180,0.25) 50%, transparent 80%)",
          borderRadius: "55% 45% 60% 40% / 40% 60% 40% 60%",
          filter: "blur(5px)",
          transform: "rotate(20deg)",
        }}
      />

      {/* Amber/yellow highlight accent — right mid */}
      <div
        className="absolute"
        style={{
          top: "30%",
          right: "8%",
          width: "30%",
          height: "35%",
          background:
            "radial-gradient(ellipse 55% 50% at 60% 40%, rgba(240,160,20,0.50) 0%, transparent 70%)",
          borderRadius: "40% 60% 50% 50% / 50% 50% 50% 50%",
          filter: "blur(3px)",
        }}
      />

      {/* Dark overlay on left side to fade into content area */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #0a1428 0%, #0a1428 20%, rgba(10,20,40,0.6) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
