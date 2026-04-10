import { createContext, useMemo, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase/firebase"
import type {AuthContextValue ,User} from "../models/Auth.types"
import { doc, getDoc, setDoc,serverTimestamp } from "firebase/firestore";

 export const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null >(null);
 
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth(), async (firebaseUser) => {
      try{
        if (!isMounted) return;
        setLoading(true);
        setError(null);
        if(!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }  // its mean there is no user are login or registered ! ?
        let ref = doc(db(),"users",firebaseUser.uid) // get the username from the firebase storage 
        let snap =await getDoc(ref) 
        if(!snap.exists()){
          await setDoc(ref,{
            email: firebaseUser.email ?? null,
            displayName: firebaseUser.displayName ?? null,
            photoURL: firebaseUser.photoURL ?? null,
            role: "customer",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },{merge:true})
        }
         const snap2 = snap.exists() ? snap : await getDoc(ref);
        const data = snap2.data();

      const appUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: (data?.role),
      };
      
       setUser(appUser);
      setLoading(false);
      }
      catch(err:unknown){
        let safeError =err instanceof Error ? err.message :"some server other Errors "
        if (!isMounted) return;
      setError(safeError);
      setUser(null);
      setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      setError,
    }),
    [user, loading, error]
  );
  return (
  < AuthContext.Provider value={value}>{
    children
  }</ AuthContext.Provider>
  )
}

export default AuthProvider
