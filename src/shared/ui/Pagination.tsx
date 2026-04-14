type Props = {
  page: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  goTo: (p: number) => void
}

export function Pagination({ page, totalPages, hasPrev, hasNext, goTo }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => goTo(page - 1)}
        disabled={!hasPrev}
        className="px-3 py-1.5 rounded-lg border border-[#E7DFD4] text-sm text-[#6E655E] hover:bg-[#F7F3EC] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>

      <span className="text-sm text-[#9A948D]">
        Page <span className="font-semibold text-[#2B2B2B]">{page}</span> of {totalPages}
      </span>

      <button
        onClick={() => goTo(page + 1)}
        disabled={!hasNext}
        className="px-3 py-1.5 rounded-lg border border-[#E7DFD4] text-sm text-[#6E655E] hover:bg-[#F7F3EC] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  )
}
