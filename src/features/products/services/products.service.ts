import {db,storage} from "@/app/firebase/firebase"
import {addDoc, collection, getDoc, getDocs, doc, deleteDoc, updateDoc} from "firebase/firestore"
import {ref,uploadBytes,getDownloadURL,deleteObject} from "firebase/storage"
import type{Product, ProductInput} from "../models/product.schema"
import {productWithIdSchema} from "../models/product.schema"


export async function Products_Service(){
    try{
        let coll=collection(db(),"Products")
        let snap_products=await getDocs(coll)
        let data_products=snap_products.docs.map(product=>{
            let raw={id:product.id,
                ...product.data()
            }
            return productWithIdSchema.parse(raw);
           
        })
         return {data:data_products,error:null}
    }catch(err:unknown){
        let msg_Err=err instanceof Error ? err.message :"Some thing wrong !!!"
        return {data:[],error:msg_Err}
    }
}



export async function createProductService({name,category,price,stock,description,discountPercent,featured,image,isAvailable}:ProductInput){
    try{
        let imageUrl:string | null =null
        if(image){const fileName = `${Date.now()}-${image?.name}`;
        const storageRef = ref(storage(), `products/${fileName}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);} 
        // before that need upload the image ??
        let ref_doc=collection(db(),"Products")
        await addDoc(ref_doc,{
            name,
            category,
            price,
            imageUrl,
            stock,
            description,
            discountPercent,
            featured,
            isAvailable

        })
        return {res:{id:ref_doc.id,imageUrl},error:null}
    }catch(err){
        const message = err instanceof Error ? err.message : "Unknown error";
        return { res: null, error: message };
        // error handler for needed 
    }
}



export async function getProductWithID(id:string):Promise<{response:Product|null,error:string|null}> {
    try{
       let ref=doc(db(),"Products",id)
       let snap_product=await getDoc(ref)
       if(!snap_product.exists()) return {response:null , error:`Product Not Founded with this ID : ${id}`}
       let data = productWithIdSchema.parse({id:snap_product.id,...snap_product.data()})
       return {response:data,error:null}
    }catch(err:unknown){
             let msg_err=err instanceof Error ? err.message :"something wrong !!!"
             return {response:null,error:msg_err}
    }
    
}



export async function deleteProductService(id: string, imageUrl?: string | null) {
  try {
    if (imageUrl) {
      const imageRef = ref(storage(), imageUrl)
      await deleteObject(imageRef).catch(() => {}) // ignore if already deleted
    }
    await deleteDoc(doc(db(), "Products", id))
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete" }
  }
}

export async function toggleAvailabilityService(id: string, isAvailable: boolean) {
  try {
    await updateDoc(doc(db(), "Products", id), { isAvailable })
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update" }
  }
}

export function calcDiscounted(price: number, discountPercent?: number) {
  const d = Math.max(0, Math.min(100, discountPercent ?? 0));
  const discounted = price * (1 - d / 100);
  return { d, discounted };
}


export function formatPrice(n: number) {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}











