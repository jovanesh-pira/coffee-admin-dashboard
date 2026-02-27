import { useEffect ,useState} from "react";
import useProducts from "../Hooks/useProducts";
import {type Product} from "../modles/product.schema"
import { Link } from "react-router-dom";
import {ProductCard} from "../components/ProductCard"

export function ProductsPage() {
  const[products,setProducts]=useState<Product[] | null>(null)
  let {get_Products,loading,error}=useProducts()
  useEffect(()=>{
    (async()=>{
      let Product_list=await get_Products()
      
      if(Product_list) setProducts(Product_list)
     
    })()

  },[])
  
  if(error) return <h1>{error}</h1>
  if(loading) return <h1>Loading....</h1>
  return  (
    <div className="mt-12 grid gap-10 md:grid-cols-4">
        {products && products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
  );
}
