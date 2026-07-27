import { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    // Initial check (in case they load the app already offline)
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowOnline(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnline(true);
      
      // Auto-hide the "Back online" message after 3 seconds
      setTimeout(() => {
        setShowOnline(false);
      }, 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full shadow-md pointer-events-none transition-all duration-300">
      {isOffline ? (
        <div className="w-full bg-rust text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center">
          ⚠ You're offline — changes will sync once reconnected.
        </div>
      ) : (
        <div className="w-full bg-success text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center">
          ✓ Back online — syncing...
        </div>
      )}
    </div>
  );
}
