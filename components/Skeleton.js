export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-ink/10 rounded"></div>
          <div className="h-3 w-24 bg-ink/10 rounded"></div>
        </div>
        <div className="h-5 w-16 bg-ink/10 rounded-full"></div>
      </div>
      <div className="border-t border-ink/10 pt-2 mb-3 space-y-2">
        <div className="flex justify-between py-1">
          <div className="h-3 w-40 bg-ink/10 rounded"></div>
          <div className="h-3 w-8 bg-ink/10 rounded"></div>
        </div>
        <div className="flex justify-between py-1">
          <div className="h-3 w-28 bg-ink/10 rounded"></div>
          <div className="h-3 w-8 bg-ink/10 rounded"></div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mt-2">
        <div className="h-10 flex-1 bg-ink/10 rounded-lg min-w-[100px]"></div>
        <div className="h-10 flex-1 bg-ink/10 rounded-lg min-w-[100px]"></div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-3 sm:p-4 flex items-center justify-between gap-3 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 sm:w-1/2 bg-ink/10 rounded"></div>
        <div className="h-3 w-1/3 sm:w-1/4 bg-ink/10 rounded"></div>
      </div>
      <div className="h-9 w-20 bg-ink/10 rounded-xl"></div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="border border-white/20 rounded-xl overflow-hidden bg-white/5 animate-pulse">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="h-5 w-32 bg-white/20 rounded"></div>
        <div className="flex items-center gap-3">
          <div className="h-5 w-6 bg-white/20 rounded-full"></div>
          <div className="h-5 w-5 bg-white/20 rounded"></div>
        </div>
      </div>
    </div>
  );
}
