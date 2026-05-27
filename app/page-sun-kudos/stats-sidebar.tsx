import { getTranslations } from "next-intl/server";
import type { CurrentUserStats } from "@/lib/sun-kudos/queries";

const STAT_ROWS: { key: keyof CurrentUserStats; labelKey: string; suffix?: string }[] = [
  { key: "kudosReceived", labelKey: "statKudosReceived" },
  { key: "kudosSent", labelKey: "statKudosSent" },
  { key: "heartsReceived", labelKey: "statHeartsReceived", suffix: "🔥" },
  { key: "secretBoxOpened", labelKey: "statSecretBoxOpened" },
  { key: "secretBoxUnopened", labelKey: "statSecretBoxUnopened" },
];

export default async function StatsSidebar({ stats }: { stats: CurrentUserStats }) {
  const t = await getTranslations("SunKudos");

  return (
    <div
      className="flex flex-col gap-4 w-full rounded-[17px] p-6"
      style={{
        background: "#00070C",
        border: "1px solid #998C5F",
      }}
    >
      <div className="flex flex-col gap-4">
        {STAT_ROWS.map(({ key, labelKey, suffix }, i) => (
          <div key={key}>
            {/* Divider before secret box stats (index 3+). */}
            {i === 3 && <div className="w-full h-px bg-[#2E3940] mb-4" />}
            <div className="flex items-center justify-between gap-2">
              {/* Label — Figma I2940:13491;256:6735: WHITE #FFF, 22px, 700, right-aligned */}
              <span
                className="font-bold leading-7"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "22px",
                  color: "#FFFFFF",
                }}
              >
                {t(labelKey)}{suffix ? ` ${suffix}` : ""}
              </span>
              <span
                className="font-bold text-[32px] leading-10 flex-shrink-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#FFEA9E",
                }}
              >
                {stats[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-[16px] transition-colors hover:bg-[#ffe47a] active:scale-95"
        style={{
          fontFamily: "Montserrat, sans-serif",
          background: "#FFEA9E",
          color: "#00101A",
        }}
      >
        {t("openSecretBox")} 🎁
      </button>
    </div>
  );
}
