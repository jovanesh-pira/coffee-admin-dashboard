
import { signInWithEmailAndPassword ,createUserWithEmailAndPassword} from "firebase/auth";
import { auth ,db} from "@/app/firebase/firebase";
import { doc,setDoc,serverTimestamp } from "firebase/firestore";



export function calcPasswordStrength(password: string) {
  let score = 0;

  if (!password) return { score: 0, label: "Empty" };

  // length points
  const len = password.length;
  if (len >= 4) score += 25;
  if (len >= 8) score += 10;
  if (len >= 10) score += 5;

  // variety points
  if (/[a-z]/.test(password)) score += 35;
  if (/[A-Z]/.test(password)) score += 35;
  if (/[^\w\s]/.test(password)) score += 40;

  // clamp 0..100
  score = Math.min(100, score);

  const label =
    score < 35 ? "Weak" :
    score < 70 ? "Medium" :
    "Strong";

  return { score, label };
}





export async function loginService(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth(), email, password);
    return { user: cred.user, error: null as string | null };
  } catch (err: any) {

    // Error handling ====>
   let err_message=err instanceof Error ? err.message :"Something went wrong";
   
    if (err?.code === "auth/invalid-credential") {
  err_message = "Incorrect email or password.";
}

if (err?.code === "auth/user-not-found") {
  err_message = "No account found with this email.";
}

if (err?.code === "auth/wrong-password") {
  err_message = "Incorrect password.";
}

if (err?.code === "auth/too-many-requests") {
  err_message = "Too many attempts. Please try again later.";
}
    return { user: null, error: err_message };
  }
}



export async function registerService(username:string,email:string,password:string):Promise<{user:any,error:string|null}>{
     try{
      let user_snap=await createUserWithEmailAndPassword(auth(),email,password)
      let ref=doc(db(),"users",user_snap.user.uid)
      let snap_doc=await setDoc(ref,{
          uid: user_snap.user.uid,
          email:email,
          displayName:username,
          role: "customer",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      })
      return { user:user_snap, error: null }
      

     }catch(err:any){
      let err_message=err instanceof Error ? err.message :"Something went wrong"
      if (err?.code === "auth/email-already-in-use") {
  err_message = "This email is already registered.";
}

// invalid email format
if (err?.code === "auth/invalid-email") {
  err_message = "Invalid email format.";
}

// weak password
if (err?.code === "auth/weak-password") {
  err_message = "Password is too weak. Use at least 6 characters.";
}

// too many requests
if (err?.code === "auth/too-many-requests") {
  err_message = "Too many attempts. Please try again later.";
}

// operation not allowed (if email/password auth disabled)
if (err?.code === "auth/operation-not-allowed") {
  err_message = "Email/password accounts are not enabled.";
}
     return {user:null,error:err_message}
    }
     
}
