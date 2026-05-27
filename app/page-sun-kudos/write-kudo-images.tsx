"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface ImagePreview {
  objectUrl: string;
  name: string;
}

interface WriteKudoImagesProps {
  images: ImagePreview[];
  /** Validation error message to display under the row */
  typeError?: string;
  onChange: (images: ImagePreview[]) => void;
  /** Called when a file with an invalid MIME type is selected */
  onTypeError: () => void;
}

const MAX_IMAGES = 5;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png"]);

export default function WriteKudoImages({
  images,
  typeError,
  onChange,
  onTypeError,
}: WriteKudoImagesProps) {
  const t = useTranslations("WriteKudo");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // Reset so the same file can be re-selected after removal.
    e.target.value = "";

    const hasInvalid = files.some((f) => !ACCEPTED_TYPES.has(f.type));
    if (hasInvalid) {
      onTypeError();
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    const accepted = files.slice(0, remaining);
    const newPreviews: ImagePreview[] = accepted.map((f) => ({
      objectUrl: URL.createObjectURL(f),
      name: f.name,
    }));
    onChange([...images, ...newPreviews]);
  }

  function removeImage(index: number) {
    // Revoke the object URL to free memory.
    URL.revokeObjectURL(images[index].objectUrl);
    onChange(images.filter((_, i) => i !== index));
  }

  const atMax = images.length >= MAX_IMAGES;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Thumbnails with remove button */}
      {images.map((img, i) => (
        <div
          key={img.objectUrl}
          className="relative w-20 h-20 rounded-[18px] border border-[#998C5F] overflow-visible flex-shrink-0"
        >
          <Image
            src={img.objectUrl}
            alt={img.name}
            fill
            className="object-cover rounded"
            unoptimized
          />
          <button
            type="button"
            onClick={() => removeImage(i)}
            aria-label={`Remove ${img.name}`}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#D4271D] flex items-center justify-center hover:bg-red-700 transition-colors z-10"
          >
            {/* Close tiny (17×17 design icon, scaled to fit 10×10 viewport) */}
            <svg width="10" height="10" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 4L4 13M4 4l9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}

      {/* + Image button — hidden at max */}
      {!atMax && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center px-3 py-1 border border-[#998C5F] rounded-lg bg-white h-12 hover:bg-[#FFF8E1] transition-colors"
          >
            <span className="text-[11px] font-bold font-[Montserrat] text-[#999] tracking-[0.5px] leading-4">
              {t("imageButton")}
            </span>
            <span className="text-[11px] font-bold font-[Montserrat] text-[#999] tracking-[0.5px] leading-4">
              {t("imageSubtitle")}
            </span>
          </button>
        </>
      )}

      {/* Type error message */}
      {typeError && (
        <p className="w-full text-xs text-[#D4271D] font-[Montserrat] mt-1">{typeError}</p>
      )}
    </div>
  );
}
