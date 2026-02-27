import { useCallback, useState } from "react"
import {registerService} from "../services/auth.service"

function useRegister() {
    const[loading,setLoading]=useState(false)
    const[error,SetError]=useState<string | null>(null)
    let register=useCallback(async(username:string,email:string,password:string)=>{
          setLoading(true)
          SetError(null)
           let res=await registerService(username,email,password);
           if(res.error){
            setLoading(false)
            SetError(res.error)
            return
           }
           setLoading(false)
           return res.user
    },[])
  return { register, loading, error };
}

export default useRegister
