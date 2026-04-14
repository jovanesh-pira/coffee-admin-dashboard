import useProducts from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { usePagination } from "@/shared/hooks/usePagination";
import { Pagination } from "@/shared/ui/Pagination";

export function ProductsPage() {
  const { products, loading, error } = useProducts()
  const { visible, page, totalPages, goTo, hasPrev, hasNext } = usePagination(products, 12)

  if (error)   return <h1>{error}</h1>
  if (loading) return <h1>Loading....</h1>

  return (
    <div className="flex flex-col gap-6 mt-12">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} hasPrev={hasPrev} hasNext={hasNext} goTo={goTo} />
    </div>
  );
}
