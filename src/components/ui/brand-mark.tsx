import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  compact?: boolean;
  hero?: boolean;
  lockup?: boolean;
  className?: string;
};

export function BrandMark({
  compact = false,
  hero = false,
  lockup = false,
  className,
}: BrandMarkProps) {
  if (lockup) {
    return (
      <div
        className={cn(
          "viva-logo-plate relative flex items-center justify-center",
          className,
        )}
      >
        <Image
          src="/brand/viva-lockup-transparent.png"
          alt="Viva - Attention that Converts"
          width={1320}
          height={484}
          priority
          className="viva-logo-light block h-auto w-full object-contain"
        />
        <Image
          src="/brand/viva-lockup-transparent-dark.png"
          alt=""
          width={1320}
          height={484}
          priority
          aria-hidden="true"
          className="viva-logo-dark hidden h-auto w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          "viva-logo-plate relative flex items-center justify-center",
          hero
            ? "w-[min(60vw,18rem)] sm:w-[20rem]"
            : compact
              ? "w-24"
              : "w-48",
        )}
      >
        <Image
          src="/brand/viva-logo-clean.png"
          alt="Viva"
          width={1076}
          height={356}
          priority
          className="viva-wordmark-image block h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
