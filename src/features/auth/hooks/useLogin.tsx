import { useCallback, useState } from "react"
import { loginService } from "../services/auth.service"


function useLogin() {
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState<string | null>(null)
    let login=useCallback(async(email:string,password:string)=>{
        setLoading(true)
        setError(null)
        let response=await loginService(email,password)
        if(response.error){
            setError(response.error)
            setLoading(false)
            return 
        }
        setLoading(false)
        return response.user
        
    },[])
    
  return {login,loading,error}
}


export default useLogin



