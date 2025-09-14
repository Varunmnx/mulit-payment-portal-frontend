interface LoadOptions {
  mode?: "sandbox" | "production";
}

interface LoadReturnType {
  success: boolean;
  // Add other properties here
}

declare module "@cashfreepayments/cashfree-js";

// ...

const load = (options: LoadOptions): Promise<LoadReturnType> => {
  // Function implementation
};
