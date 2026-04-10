import useProducts from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
export function ProductsPage() {
  const { products, loading, error } = useProducts()
  

  if (error)   return <h1>{error}</h1>
  if (loading) return <h1>Loading....</h1>

  return (
    <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    
    </div>
  );
}
