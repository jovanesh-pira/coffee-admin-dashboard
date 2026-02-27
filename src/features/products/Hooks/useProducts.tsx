import { useState,useCallback } from "react"
import { Products_Service } from "../services/products.service"

function useProducts() {
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null)
  let get_Products=useCallback(async()=>{
    setLoading(true)
    setError(null)
    let response_products=await Products_Service()
    if(response_products.error){
        setError(response_products.error)
        setLoading(false)
        return
    }
    setLoading(false)
    return response_products.data
    
  },[])
return {get_Products,loading,error}
}

export default useProducts
