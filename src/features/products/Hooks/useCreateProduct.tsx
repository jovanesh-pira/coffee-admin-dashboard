import  { useCallback, useState } from 'react'
import { createProductService } from '../services/products.service'
import type { ProductInput } from '../modles/product.schema'
function useCreateProduct() {
  const [repsonse_product,setResponse]=useState<{id:string,imageUrl:string | null} | null>(null)
  const [loading,setLoading]=useState<boolean>(false)
  const [error,setError]=useState<string|null>(null)
  let create_product=useCallback(async(data:ProductInput)=>{
          try{
            setLoading(true)
            setError(null)
            let resposne = await createProductService({...data})
            if(resposne.error){

                setError(resposne.error)
                
                    return null;}
            
            if(resposne.res) setResponse(resposne.res) 
            


          }catch(err:unknown){
            let err_msg=err instanceof Error ? err.message :"Something went wrong. Please try again."
             setError(err_msg)
             
          }  finally{
            setLoading(false)
          }
    },[])
    return {create_product,repsonse_product,error,loading,setError }
}

export default useCreateProduct
