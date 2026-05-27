import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { GiftRecipient } from "@/lib/sun-kudos/queries";

export default async function GiftRecipientsPanel({
  recipients,
}: {
  recipients: GiftRecipient[];
}) {
  const t = await getTranslations("SunKudos");

  return (
    <div
      className="flex flex-col gap-4 w-full rounded-[17px] p-6"
      style={{
        background: "#00070C",
        border: "1px solid #998C5F",
      }}
    >
      {/* Title — D.3.1_title: #FFEA9E, 22px, 700, center */}
      <h3
        className="font-bold text-[22px] leading-7 text-center"
        style={{
          fontFamily: "Montserrat, sans-serif",
          color: "#FFEA9E",
        }}
      >
        {t("giftRecipientsTitle")}
      </h3>

      {/* Recipient list */}
      <div className="flex flex-col gap-4">
        {recipients.map((recipient, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Avatar — border: 1.869px solid #FFF */}
            <div
              className="relative flex-shrink-0 rounded-full overflow-hidden"
              style={{
                width: "64px",
                height: "64px",
                border: "1.869px solid #FFFFFF",
              }}
            >
              <Image
                src={recipient.avatarUrl}
                alt={recipient.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Name — I2940:13516;256:7462: #FFEA9E, 22px, 700 */}
              <span
                className="font-bold text-[22px] leading-7 truncate"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#FFEA9E",
                }}
              >
                {recipient.name}
              </span>
              {/* Gift sublabel — I2940:13516;256:7472: #FFF, 16px, 700 */}
              <span
                className="font-bold text-[16px] leading-6"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#FFFFFF",
                }}
              >
                {recipient.gift}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
