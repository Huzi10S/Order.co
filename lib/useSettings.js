import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./collections";
import { PRODUCT_SECTIONS } from "./constants";

export function useSettings() {
  const [showPrice, setShowPrice] = useState(false);
  const [categories, setCategories] = useState(PRODUCT_SECTIONS);
  const [settings, setSettings] = useState({
    shopName: "Supreme Sanitary",
    ownerName: "Murtaza Haveliwala / Mustafa Haveliwala",
    phone: "+91 8770341266 (WhatsApp), +91 9111293990",
    address: "Shop No.1, Happy Apartment, Rajiv Gandhi Civic Centre, Near Lokendra Talkies, New Road, Ratlam (457001) M.P.",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, COLLECTIONS.settings, "config"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShowPrice(!!data.showPriceToCustomer);
          setSettings((prev) => ({ ...prev, ...data }));
          if (data.categories && Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else {
            setCategories(PRODUCT_SECTIONS);
          }
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

  return { showPrice, settings, categories, loaded };
}
