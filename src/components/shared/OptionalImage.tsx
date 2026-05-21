import { useEffect, useState, type ReactNode } from "react";

type OptionalImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  loading?: "eager" | "lazy";
};

export function OptionalImage({
  src,
  alt,
  className,
  fallback,
  loading = "lazy",
}: OptionalImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading={loading}
      decoding="async"
    />
  );
}
