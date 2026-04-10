import { db } from "@/app/firebase/firebase"
import {collection,addDoc} from "firebase/firestore"
import {type Order} from "../cart.types"
export async function createOrder_Service({data}:{data:Order})
:Promise<{response:string|null,error:string|null}>{
    try{
        await addDoc(collection(db(),"Orders"),data)
        return {response:"Order is Created !", error:null}
    }catch(err){
        let err_msg=err instanceof Error ? err.message : "Some thing gone Wrong sry !!"
        console.error("Write failed:", err);
        return {response:null , error:err_msg}
    }
    
}