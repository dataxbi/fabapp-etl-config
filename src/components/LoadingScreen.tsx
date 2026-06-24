export function LoadingScreen({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0066cc]" />
        <span className="text-sm text-[#666666]">{label}</span>
      </div>
    </div>
  );
}
