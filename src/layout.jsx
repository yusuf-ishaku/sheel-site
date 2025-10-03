"use client";
import React from "react";
import wagmiConfig from "./lib/walletConfig"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from "wagmi";
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
    
  return (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{children}</RainbowKitProvider>{" "}
          </QueryClientProvider>
        </WagmiProvider>
  );
}
