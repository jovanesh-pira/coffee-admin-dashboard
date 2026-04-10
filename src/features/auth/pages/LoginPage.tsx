import { useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { InputComponent } from "@/shared/ui/Input"
import { calcPasswordStrength } from "@/features/auth/services/auth.service"
import { PasswordStrengthMeter } from "../components/PasswordStrengthMeter"
import useLogin from "../hooks/useLogin";
import { type LoginFormValues, loginSchema } from "@/features/auth/models/Auth.schema"
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useLogin()
  const { user, loading: authLoading } = useAuth()

  // Navigate AFTER AuthContext finishes loading user + role from Firestore
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") navigate("/admin", { replace: true })
      else navigate("/", { replace: true })
    }
  }, [user, authLoading])

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "all"
  });

  const mypassword = methods.watch("password")
  const strength = useMemo(() => calcPasswordStrength(mypassword), [mypassword]);

  async function onSubmit(data: LoginFormValues) {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen bg-[#f6f3ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#5C4033]">Sign in to Coffee ☕</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 text-sm bg-red-100 text-red-600 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

            <InputComponent
              name="email"
              typeInput="email"
              placeholder="you@email.com"
              label="Email"
              extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
            />

            <div>
              <InputComponent
                name="password"
                typeInput="password"
                placeholder="••••••••"
                label="Password"
                extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
              />
              <PasswordStrengthMeter score={strength.score} label={strength.label} />
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-[#5C4033] text-white py-2.5 rounded-lg font-medium hover:bg-[#4a3328] transition disabled:opacity-60"
            >
              {loading || authLoading ? "Signing in..." : "Login"}
            </button>

          </form>
        </FormProvider>

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#5C4033] font-medium hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
