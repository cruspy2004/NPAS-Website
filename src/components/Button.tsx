import { WarpLink } from "./Warp";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  arrow?: boolean;
  className?: string;
  external?: boolean;
};

const styles = {
  primary: "bg-ink text-bg hover:bg-white",
  ghost: "border border-line text-ink hover:border-muted",
};

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  arrow = variant === "primary",
  className = "",
  external,
}: Props) {
  const cls = `group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors ${styles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <span className="transition-transform group-hover:translate-x-0.5">
          <Arrow />
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <WarpLink href={href} className={cls}>
      {inner}
    </WarpLink>
  );
}
