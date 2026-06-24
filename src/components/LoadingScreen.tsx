export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/20 backdrop-blur">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
