import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {InputComponent} from "@/shared/ui/Input"
import {calcPasswordStrength} from "@/features/auth/services/auth.service"
import {PasswordStrengthMeter} from "../components/PasswordStrengthMeter"
import useLogin from "../hooks/useLogin";
import {type LoginFormValues ,loginSchema} from "@/features/auth/models/Auth.schema"
export function LoginPage() {
  const navigation=useNavigate()
const {login,loading,error}=useLogin()

const methods = useForm({
  resolver:zodResolver(loginSchema),defaultValues:{
    email:"",
    password:""
  },
  mode:"all"
});
   let mypassword=methods.watch("password")
   console.log(mypassword)
   const strength = useMemo(() => calcPasswordStrength(mypassword), [mypassword]);
   
  //  Submit handler ====>  ====> =====>
   async function onSubmit(data:LoginFormValues) {
    let user_res=await login(data.email,data.password)
    if(user_res) navigation("/",{replace:true})
  
    

   
  }




   

  return (
    <div className="min-h-screen bg-[#f6f3ef] flex items-center justify-center px-4">
      
      {/* card */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        
        {/* title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#5C4033]">
            Sign in to Coffee ☕
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Admin dashboard login
          </p>
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 text-sm bg-red-100 text-red-600 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* form */}
        <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* email */}
          <div>
            <InputComponent name="email" typeInput="email" placeholder="admin@email.com" label="Email" 
            extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"></InputComponent>
           
          </div>

          {/* password */}
           
          <div>
          <InputComponent name="password" typeInput="password" placeholder="••••••••" label="Password" 
            extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"></InputComponent>
           <PasswordStrengthMeter score={strength.score} label={strength.label}/>
          </div>

          {/* button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C4033] text-white py-2.5 rounded-lg font-medium hover:bg-[#4a3328] transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        </FormProvider>

        {/* bottom */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Don’t have account?{" "}
          <span className="text-[#5C4033] font-medium cursor-pointer">
            Register
          </span>
        </div>
      </div>
    </div>
  );
}