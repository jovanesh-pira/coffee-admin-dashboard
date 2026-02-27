import  { useMemo, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {runTransaction,doc,serverTimestamp,collection} from "firebase/firestore"
import { checkoutSchema ,type CheckoutValues,type CustomerData,type Order} from "../cart.types";
import { InputComponent } from "@/shared/ui/Input";
import { CartContext } from "../cart.reducer";
import {db} from "@/app/firebase/firebase"
import { useAuth } from "@/features/auth/context/useAuth";


function CheckoutPage() {
  const ctx = useContext(CartContext);
  const items = ctx?.state.cartlist ?? [];
  const {user} =useAuth()
  if(!user) throw new Error("Theres no User")
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

  const CheckOutHandler = async(data: CheckoutValues) => {
   const customerRef =doc(db(),"Customers",user?.uid)
   const orderRef = doc(collection(db(), "orders"));
    
    await runTransaction(db(),async(trx)=>{
        for(const item of items){
            console.log(item)
            const ref_doc=doc(db(),"Products",item.productId)
        const snap_product=await trx.get(ref_doc)
        if(!snap_product.exists())  throw new Error("Product Not Founded with this ID !!")
        let stock=snap_product.data().stock ?? 0
         if(stock< item.qty)  throw new Error("Not enough stock");
         console.log(snap_product.data())
        }
        for (const item of items) {
    const productRef = doc(db(), "Products", item.productId);
    const snap = await trx.get(productRef);
    if(!snap.exists())  throw new Error("Product Not Founded with this ID !!")
    const stock = snap.data().stock ?? 0;

    trx.update(productRef, { stock: stock - item.qty });
    console.log("updating of the Stock is Done !")
  }

  
let customerData:CustomerData = {fullName:data.fullName,city:data.city,phone:data.phone,street:data.street}
let orderData = {
  customerId:user.uid,
  items:items,       
  total:subtotal,
  status: "pending",
  createdAt: serverTimestamp(),}
trx.set(customerRef, { ...customerData, updatedAt: serverTimestamp() }, { merge: true });
console.log("Customer is created !!")
trx.set(orderRef, { ...orderData, createdAt: serverTimestamp() });
    })
    console.log("checkout data:", data);
    console.log("cart items:", items);
    console.log("subtotal:", subtotal);
  };

  return (
    <div className="min-h-[70vh] bg-neutral-50">
      <div className="mx-auto max-w-5xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-neutral-200 p-5">
          <h1 className="text-xl font-semibold text-neutral-900">Checkout</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your contact and delivery address.
          </p>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(CheckOutHandler)}
              className="mt-5 space-y-4"
            >
              <InputComponent
                name="fullName"
                placeholder="Dimash Qudaibergen"
                typeInput="text"
                label="Full name"
                extraClass="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
              />

              <InputComponent
                name="phone"
                placeholder="+7 777 123 45 67"
                typeInput="text"
                label="Phone"
                extraClass="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputComponent
                  name="city"
                  placeholder="Almaty"
                  typeInput="text"
                  label="City"
                  extraClass="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
                />

                <InputComponent
                  name="street"
                  placeholder="Abylai Khan 10"
                  typeInput="text"
                  label="Street"
                  extraClass="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
                />
              </div>

              <InputComponent
                name="details"
                placeholder="Apartment / floor / code (optional)"
                typeInput="text"
                label="Details"
                extraClass="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
              />

             
              <div>
                <label className="text-sm text-neutral-700">Note</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900 min-h-[90px]"
                  {...methods.register("note")}
                  placeholder="Optional note for delivery..."
                />
                {methods.formState.errors.note?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {methods.formState.errors.note.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={items.length === 0} 
                className={[
                  "w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                  items.length === 0
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-900 text-white hover:bg-neutral-800",
                ].join(" ")}
              >
                Place Order
              </button>
            </form>
          </FormProvider>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-200 p-5 h-fit">
          <h2 className="text-base font-semibold text-neutral-900">
            Order summary
          </h2>

          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">Cart is empty</p>
            ) : (
              items.map((it) => (
                <div key={it.productId} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-100">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {it.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {it.qty} × ${it.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">
                    ${(it.qty * it.unitPrice).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-4">
            <div className="flex justify-between text-sm text-neutral-700">
              <span>Total</span>
              <span className="font-semibold text-neutral-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;