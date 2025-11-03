import React from "react";
type Size = "sm" | "md" | "lg";

interface LogoProps {
  size?: Size;
  hideText?: boolean;
  href?: string | null;
  alt?: string;
  className?: string;
  /**
   * Custom image src (defaults to /assets/logo.jpg)
   * Use an actual path in your project (public folder or imported asset).
   */
  src?: string;
  /**
   * Optional click handler if you want SPA navigation instead of an anchor.
   */
  onClick?: () => void;
}

const sizeMap: Record<Size, { img: string; text: string; gap: string }> = {
  sm: { img: "h-6 w-6", text: "text-sm", gap: "gap-2" },
  md: { img: "h-10 w-10", text: "text-base", gap: "gap-1" },
  lg: { img: "h-14 w-14", text: "text-xl", gap: "gap-4" },
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  hideText = false,
  href = "/",
  alt = "addis tech logo",
  className = "",
  src = "/assets/logo.jpg",
  onClick,
}) => {
  const styles = sizeMap[size];

  const content = (
    <div
      className={`inline-flex items-center ${styles.gap} select-none ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label="addis tech"
    >
      <img
        src={src}
        alt={alt}
        className={`object-contain ${styles.img} rounded-sm`}
        loading="lazy"
      />
      {!hideText && (
        <span
          className={`font-semibold tracking-tight text-gray-900 dark:text-gray-100 ${styles.text}`}
        >
          addis tech
        </span>
      )}
    </div>
  );

  if (href === null) {
    // Render as plain element (no anchor)
    return content;
  }

  // Anchor wrapper (useful in header/footer). If you prefer SPA navigation,
  // pass onClick and set href=null, then handle navigation in onClick.
  return (
    <a href={href} className="inline-block" aria-label="Go to homepage">
      {content}
    </a>
  );
};

export default Logo;
