"use client";

import { createContext, useContext } from "react";

const BrandbookPrintContext = createContext(false);

export function BrandbookPrintProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrandbookPrintContext.Provider value={true}>{children}</BrandbookPrintContext.Provider>
  );
}

export function useBrandbookPrint() {
  return useContext(BrandbookPrintContext);
}
