import { useState, useMemo } from "react"

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // reset to page 1 if items change (e.g. filter/search applied)
  const safePage = Math.min(page, totalPages)

  const visible = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  return {
    visible,
    page: safePage,
    totalPages,
    goTo,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }
}
