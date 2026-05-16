type Props = {
  visible: boolean;
};

/** Spinner shown over video/iframes until load. */
export default function VideoLoadingOverlay({ visible }: Props) {
  if (!visible) return null;
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/75"
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="h-11 w-11 rounded-full border-2 border-white/25 border-t-white animate-spin motion-reduce:animate-none motion-reduce:border-t-white/40"
        aria-hidden
      />
      <span className="text-sm text-white/80">Cargando video…</span>
    </div>
  );
}
