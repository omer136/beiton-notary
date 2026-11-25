// The BEITON logo as live text, as in the office's brand files (BEITON repo, firm/08-BRAND.md):
// the word alone where space is narrow (nav, footer); the word, a thin line and BEYOND LAW, all on one centre axis, where it is shown large.
// Since 25.11.2026 the name is BEITON, without "& Co".
export default function BrandLogo({ slogan = false, size, className = "" }: { slogan?: boolean; size?: number | string; className?: string }) {
  return (
    <span className={`bLogo${slogan ? " bLogoS" : ""}${className ? ` ${className}` : ""}`} style={size ? { fontSize: size } : undefined} role="img" aria-label={slogan ? "BEITON, BEYOND LAW" : "BEITON"}>
      <b aria-hidden="true">BEITON</b>
      {slogan && (
        <>
          <i aria-hidden="true" />
          <span aria-hidden="true">BEYOND LAW</span>
        </>
      )}
    </span>
  );
}
