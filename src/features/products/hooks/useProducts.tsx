import { useState, useEffect } from "react"
import { Products_Service } from "../services/products.service"
import { type Product } from "../models/product.schema"

function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    setLoading(true)
    Products_Service()
      .then(res => {
        if (res.error) setError(res.error)
        else setProducts(res.data ?? [])
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [tick])

  const refetch = () => setTick(t => t + 1)

  return { products, loading, error, refetch }
}

export default useProducts
