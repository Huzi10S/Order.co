import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useSettings() {
  const [showPrice, setShowPrice] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "config"),
      (docSnap) => {
        if (docSnap.exists()) {
          setShowPrice(!!docSnap.data().showPriceToCustomer);
        }
        setLoaded(true);
      },
      (err) => {
        console.error("Settings listener error:", err);
        setLoaded(true);
      }
    );
    return () => unsub();
  }, []);

  return { showPrice, loaded };
}
