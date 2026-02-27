import { useState } from "react"
import { Controller ,useFormContext } from "react-hook-form"

import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
type props={
    name:string,
    typeInput:string,
    placeholder:string,
    label?:string,
    extraClass?:string
}
export const InputComponent=({name,typeInput="text",placeholder="placeholder",label,extraClass}:props)=>{
    const {control}=useFormContext()
    const [showPass,setShowPass]=useState(false)
    return (
       <div className="flex flex-col gap-1">
         {label && <label className="text-sm">{label}</label>}
        <Controller 
        name={name}
        control={control}
        render={({field,fieldState})=>{

            return (
                <>
            
           {typeInput=="password" ?(
          <div className="relative flex items-center flex-row">
           <input 
            {...field}
             type={showPass?"text":typeInput}
              placeholder={placeholder} 
              className={extraClass}></input> 
            <button 
            onClick={()=>{setShowPass(prev=>!prev)}} 
            type="button" 
            className={`absolute right-3 text-xl opacity-40`} >
                {showPass?<FaEye />:<FaRegEyeSlash/>}
                </button></div> ):( <input {...field} type={typeInput} placeholder={placeholder} className={extraClass}></input>)}
            {fieldState.error &&( <span className={`text-red-500 text-xs `}>
                {fieldState.error.message}
              </span>)}
            </>
            )
        }}
        />
       </div>
        
    )
}