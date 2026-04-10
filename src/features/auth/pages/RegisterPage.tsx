import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { registerSchema, type RegisterFormValues_input } from "../models/Auth.schema";
import useRegister from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";
import { InputComponent } from "@/shared/ui/Input";
import { useAuth } from "../hooks/useAuth";

function EmailServerHint({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[110%] hidden md:block">
      <div className="relative rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg border border-gray-800">
        {message}
        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-800 rotate-45" />
      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const methods = useForm<RegisterFormValues_input>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const { register, loading, error } = useRegister();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") navigate("/admin", { replace: true })
      else navigate("/", { replace: true })
    }
  }, [user, authLoading])

  // اگر error شما string هست، اینجا خیلی ساده تبدیلش می‌کنیم به پیام برای ایمیل
  const emailServerError = useMemo(() => {
    if (!error) return "";
    // مثال: error کد فایربیس یا متن شما
    if (error.includes("auth/email-already-in-use") || error.toLowerCase().includes("already")) {
      return "This email has already been used";
    }
    return "";
  }, [error]);

  const RegisterSubmit = async (data: RegisterFormValues_input) => {
    await register(data.fullName, data.email, data.password);
    // navigation handled by useEffect above
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="min-h-screen flex items-stretch">
        {/* Left: Form panel */}
        <div className="w-full lg:w-[48%] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white grid place-items-center font-bold">
                ∫
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
            <p className="text-neutral-500 mt-2">Start your 30-day free trial.</p>

            <div className="mt-8">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(RegisterSubmit)} className="space-y-5">
                  <InputComponent
                    name="fullName"
                    label="Name"
                    placeholder="Enter your name"
                    typeInput="text"
                    extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  />

                  {/* Email field with server tooltip */}
                  <div className="relative">
                    <InputComponent
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                      typeInput="email"
                      extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                    />
                    <EmailServerHint message={emailServerError} />

                    {/* Mobile fallback text */}
                    {emailServerError && (
                      <p className="md:hidden mt-2 text-xs text-red-600">{emailServerError}</p>
                    )}
                  </div>

                  <InputComponent
                    name="password"
                    label="Password"
                    placeholder="Create a password"
                    typeInput="password"
                    extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  />

                  <InputComponent
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    typeInput="password"
                    extraClass="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  />

                  {/* Hint under password like the image */}
                  <p className="-mt-3 text-xs text-neutral-500">
                    Must be at least 8 characters.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !methods.formState.isValid}
                    className={[
                      "w-full rounded-lg py-3 font-medium transition",
                      "focus:outline-none focus:ring-2 focus:ring-neutral-900/30",
                      loading || !methods.formState.isValid
                        ? "bg-neutral-300 text-neutral-700 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-neutral-800",
                    ].join(" ")}
                  >
                    {loading ? "Creating account..." : "Get started"}
                  </button>

                  {/* General server error (non-email) */}
                  {error && !emailServerError && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <p className="text-center text-sm text-neutral-500 pt-2">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-neutral-900 font-medium underline underline-offset-4 hover:text-neutral-700"
                    >
                      Log in
                    </a>
                  </p>
                </form>
              </FormProvider>

              <div className="mt-10 flex items-center justify-between text-xs text-neutral-400">
                <span>© {new Date().getFullYear()} Coffee</span>
                <a className="hover:text-neutral-600" href="mailto:info@coffee.com">
                  info@coffee.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Image panel */}
        <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1800&q=80&auto=format&fit=crop')",
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Big logo mark */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-white/95 select-none">
              <div className="text-[160px] font-black leading-none tracking-tight">
                ∫
              </div>
            </div>
          </div>

          {/* Soft rounded corner like screenshot */}
          <div className="absolute inset-0 ring-1 ring-black/10" />
        </div>
      </div>
    </div>
  );
}