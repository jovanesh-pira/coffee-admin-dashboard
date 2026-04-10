import { useMemo, useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runTransaction, doc, serverTimestamp, collection } from "firebase/firestore"
import { checkoutSchema, type CheckoutValues, type CustomerData } from "../cart.types";
import { InputComponent } from "@/shared/ui/Input";
import { CartContext } from "../cart.reducer";
import { db } from "@/app/firebase/firebase"
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatPrice } from "@/features/products/services/products.service";
import { useNavigate } from "react-router-dom";

const inputClass = "mt-1 w-full rounded-xl border border-coffee-600 bg-coffee-700 text-white placeholder-coffee-400 px-3 py-2.5 text-sm outline-none focus:border-amber-700 transition"

function CheckoutPage() {
  const ctx = useContext(CartContext);
  const items = ctx?.state.cartlist ?? [];
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)
  if (!user) throw new Error("Theres no User")

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  }, [items]);

  const methods = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "Almaty",
      street: "",
      details: "",
      note: "",
    },
    mode: "onTouched",
  });

  const CheckOutHandler = async (data: CheckoutValues) => {
    setSubmitting(true)
    setTxError(null)
    try {
      const customerRef = doc(db(), "Customers", user?.uid)
      const orderRef = doc(collection(db(), "orders"));

      await runTransaction(db(), async (trx) => {
        // ── Phase 1: ALL reads ──────────────────────────────
        const snaps = await Promise.all(
          items.map(item => trx.get(doc(db(), "Products", item.productId)))
        )

        // ── Phase 2: validate stock ─────────────────────────
        for (let i = 0; i < items.length; i++) {
          if (!snaps[i].exists()) throw new Error(`Product not found: ${items[i].name}`)
          const stock = snaps[i].data()!.stock ?? 0
          if (stock < items[i].qty) throw new Error(`Not enough stock for "${items[i].name}"`)
        }

        // ── Phase 3: ALL writes ─────────────────────────────
        for (let i = 0; i < items.length; i++) {
          const stock = snaps[i].data()!.stock ?? 0
          trx.update(snaps[i].ref, { stock: stock - items[i].qty })
        }
        const customerData: CustomerData = { fullName: data.fullName, city: data.city, phone: data.phone, street: data.street }
        const orderData = { customerId: user.uid, items, total: subtotal, status: "pending", createdAt: serverTimestamp() }
        trx.set(customerRef, { ...customerData, updatedAt: serverTimestamp() }, { merge: true })
        trx.set(orderRef, { ...orderData, createdAt: serverTimestamp() })
      })

      ctx?.dispatch({ type: "CLEAR" })
      navigate("/")
    } catch (e: any) {
      setTxError(e.message ?? "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Page title */}
        <div className="mb-8">
          <span className="text-xs tracking-[0.3em] uppercase text-amber-700 font-medium">Almost there</span>
          <h1 className="font-bebas text-4xl md:text-5xl text-white tracking-wide mt-1">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── Form ── */}
          <div className="md:col-span-3 bg-coffee-800 border border-coffee-700 rounded-2xl p-6">
            <h2 className="font-bebas text-xl tracking-wide text-white mb-1">Delivery Info</h2>
            <p className="text-xs text-coffee-300 mb-6">Enter your contact and delivery address.</p>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(CheckOutHandler)} className="space-y-4">

                <InputComponent
                  name="fullName"
                  placeholder="Dimash Qudaibergen"
                  typeInput="text"
                  label="Full Name"
                  extraClass={inputClass}
                />

                <InputComponent
                  name="phone"
                  placeholder="+7 777 123 45 67"
                  typeInput="text"
                  label="Phone"
                  extraClass={inputClass}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputComponent
                    name="city"
                    placeholder="Almaty"
                    typeInput="text"
                    label="City"
                    extraClass={inputClass}
                  />
                  <InputComponent
                    name="street"
                    placeholder="Abylai Khan 10"
                    typeInput="text"
                    label="Street"
                    extraClass={inputClass}
                  />
                </div>

                <InputComponent
                  name="details"
                  placeholder="Apartment / floor / code (optional)"
                  typeInput="text"
                  label="Details"
                  extraClass={inputClass}
                />

                <div>
                  <label className="text-sm text-coffee-200">Note</label>
                  <textarea
                    {...methods.register("note")}
                    placeholder="Optional note for delivery..."
                    className={`${inputClass} min-h-24 resize-none`}
                  />
                  {methods.formState.errors.note?.message && (
                    <p className="mt-1 text-xs text-red-400">
                      {methods.formState.errors.note.message as string}
                    </p>
                  )}
                </div>

                {txError && (
                  <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
                    {txError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={items.length === 0 || submitting}
                  className={[
                    "w-full rounded-full py-3 text-sm font-semibold tracking-wide transition",
                    items.length === 0 || submitting
                      ? "bg-coffee-700 text-coffee-500 cursor-not-allowed"
                      : "bg-amber-800 text-white hover:bg-amber-700",
                  ].join(" ")}
                >
                  {submitting ? "Placing Order..." : "Place Order →"}
                </button>

              </form>
            </FormProvider>
          </div>

          {/* ── Order Summary ── */}
          <div className="md:col-span-2 h-fit bg-coffee-800 border border-coffee-700 rounded-2xl p-6">
            <h2 className="font-bebas text-xl tracking-wide text-white mb-4">Order Summary</h2>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-coffee-400">Your cart is empty.</p>
              ) : (
                items.map((it) => (
                  <div key={it.productId} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-coffee-700 shrink-0">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{it.name}</p>
                      <p className="text-xs text-coffee-400">{it.qty} × {formatPrice(it.unitPrice)}</p>
                    </div>
                    <p className="text-sm font-semibold text-amber-400 shrink-0">
                      {formatPrice(it.qty * it.unitPrice)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-5 pt-4 border-t border-coffee-700 flex justify-between items-center">
                <span className="text-sm text-coffee-300">Total</span>
                <span className="font-bebas text-2xl text-amber-400 tracking-wide">
                  {formatPrice(subtotal)}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
