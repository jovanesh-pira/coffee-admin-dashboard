import  { useState,useCallback } from 'react'
import {getProductWithID} from "../services/products.service"
import type { Product } from '../modles/product.schema'
function useProductWithID() {
  const [product,SetProduct]=useState<Product|null>(null)
   const [loading,setLoading]=useState(false)
     const [error,setError]=useState<string|null>(null)
     let get_Products_with_ID=useCallback(async(id:string)=>{
       setLoading(true)
       setError(null)
       let response_products=await getProductWithID(id)
       if(response_products.error){
           setError(response_products.error)
           setLoading(false)
           SetProduct(null)
           return
       }
       setLoading(false)
       SetProduct(response_products.response)
       return response_products.response
       
     },[])
   return {get_Products_with_ID,loading,error,product,SetProduct}
}

export default useProductWithID
