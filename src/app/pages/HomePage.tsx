import { useAuth } from "@/features/auth/context/useAuth";

export function HomePage() {
  const { user, loading } = useAuth();
console.log("AUTH:", { user, loading });
  return <div className="p-4">Home page</div>;
}
