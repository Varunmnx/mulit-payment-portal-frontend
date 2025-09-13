/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';

// Types
interface CashfreeInstance {
  // Add specific Cashfree methods/properties based on their API
  checkout: (options: any) => Promise<any>;
  // Add other methods as needed
}

declare global {
  interface Window {
    Cashfree?: any;
  }
}

interface UseCashfreeOptions {
  // Add any initialization parameters needed
  environment?: 'sandbox' | 'production';
}

interface UseCashfreeReturn {
  cashfree: CashfreeInstance | null;
  isLoading: boolean;
  error: Error | null;
  load: () => Promise<CashfreeInstance | null>;
}

const V3_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";
const V3_URL_REGEX = /^https:\/\/sdk\.cashfree\.com\/js\/v3\/?(\?.*)?$/;
const EXISTING_SCRIPT_MESSAGE = "load was called but an existing Cashfree.js script already exists in the document; existing script parameters will be used";

// Checks whether v3 js script exists in the website
const findScript = (): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll(`script[src^="${V3_URL}"]`);
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i] as HTMLScriptElement;
    if (!V3_URL_REGEX.test(script.src)) {
      continue;
    }
    return script;
  }
  return null;
};

// Injects v3 js script to the website
const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = V3_URL;
  const headOrBody = document.head || document.body;
  
  if (!headOrBody) {
    throw new Error("Expected document.body not to be null. Cashfree.js requires a <body> element.");
  }
  
  headOrBody.appendChild(script);
  return script;
};

let cashfreePromise: Promise<any> | null = null;

const loadScript = (): Promise<any> => {
  // Ensure that we only attempt to load Cashfree.js at most once
  if (cashfreePromise !== null) {
    return cashfreePromise;
  }

  cashfreePromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    try {
      let script = findScript();
      if (script) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else {
        script = injectScript();
      }

      script.addEventListener("load", () => {
        if (window.Cashfree) {
          resolve(window.Cashfree);
        } else {
          reject(new Error("Cashfree.js not available"));
        }
      });

      script.addEventListener("error", () => {
        reject(new Error("Failed to load Cashfree.js"));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });

  return cashfreePromise;
};

const initCashfree = (maybeCashfree: any, ...args: any[]): CashfreeInstance | null => {
  if (maybeCashfree === null) {
    return null;
  }
  
  // eslint-disable-next-line prefer-spread
  const cashfree = maybeCashfree.apply(undefined, args);
  return cashfree;
};

export const useCashfree = (): UseCashfreeReturn => {
  const [cashfree, setCashfree] = useState<CashfreeInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadCalledRef = useRef(false);

  const load = useCallback(async (): Promise<CashfreeInstance | null> => {
    if (loadCalledRef.current && cashfree) {
      return cashfree;
    }

    loadCalledRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const maybeCashfree = await loadScript();
      const cashfreeInstance = initCashfree(maybeCashfree);
      
      setCashfree(cashfreeInstance);
      setIsLoading(false);
      
      return cashfreeInstance;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load Cashfree');
      setError(error);
      setIsLoading(false);
      console.warn(error);
      return null;
    }
  }, [cashfree]);

  // Auto-load on mount if in browser environment
  useEffect(() => {
    if (typeof window !== "undefined" && !loadCalledRef.current) {
      load();
    }
  }, [load]);

  return {
    cashfree,
    isLoading,
    error,
    load,
  };
};

export default useCashfree;