export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span
        className="text-2xl font-medium tracking-[0.2em] text-brand-dark"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      >
        BEITON
      </span>
      <span
        className="text-sm font-normal tracking-[0.15em] text-brand-gray"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      >
        &amp; Co
      </span>
    </div>
  );
}
