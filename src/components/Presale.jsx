"use client";
import React, { useState } from "react";
import { FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { useAccount, useBalance } from "wagmi";
import usePresaleContract from '../hooks/usePresaleContract'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";

export default function Presale() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { 
    raised, 
    target, 
    loading, 
    buy,
    isWhitelisted,
    userContributions,
    presaleActive,
    soldOut,
    paused
  } = usePresaleContract()

  const [amount, setAmount] = useState("");
  // loading provided by hook

  // on-chain reads are handled in usePresaleContract hook

  const handleBuy = async () => {
    if (!isConnected) {
      toast.error("⚠️ Please connect your wallet first");
      return;
    }

    // Check presale status first
    if (!presaleActive) {
      toast.error("⚠️ Presale is not currently active");
      return;
    }
    if (soldOut) {
      toast.error("⚠️ Presale has sold out");
      return;
    }
    if (paused) {
      toast.error("⚠️ Presale is currently paused");
      return;
    }
    if (!isWhitelisted) {
      toast.error("⚠️ Your wallet is not whitelisted for this presale");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("⚠️ Enter a valid amount");
      return;
    }

    const amt = Number(amount);
    if (amt < 0.05) {
      toast.error("⚠️ Minimum contribution is 0.05 BNB");
      return;
    }
    if (amt > 0.1) {
      toast.error("⚠️ Maximum contribution is 0.1 BNB");
      return;
    }
    if (userContributions + amt > 0.1) {
      toast.error(`⚠️ Maximum 0.1 BNB per wallet. You have already contributed ${userContributions.toFixed(4)} BNB`);
      return;
    }

    try {
      toast.loading("⏳ Processing... confirm in wallet", { id: "tx" });

      await buy(amount)

      toast.loading("\u23f3 Waiting for confirmation...", { id: "tx" });

      // buy() inside hook waits for receipt and refreshes
      toast.success("🎉 Purchase successful!", { id: "tx" });
      setAmount("");
    } catch (err) {
      console.error(err);
      toast.error("❌ " + (err?.reason || err?.message || "Transaction failed"), { id: "tx" });
    }
  };
  const progressPercent = Math.min(100, target > 0 ? (raised / target) * 100 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF3E0] w-full text-[#0B2436]">
      {/* Header */}
      <header className="w-full flex justify-center pt-6 px-4">
        <div className="w-full max-w-7xl rounded-2xl border-4 border-black px-6 py-3 flex items-center justify-between bg-transparent">
          <h1 className="text-orange-400 text-2xl md:text-3xl font-extrabold tracking-wide">
            9BNB
          </h1>

          <div className="flex items-center gap-3">
            <button
              aria-label="telegram"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-orange-400 bg-[#FFF6EA] hover:scale-110 transition"
            >
              <FaTelegramPlane className="text-orange-400" />
            </button>
            <button
              aria-label="twitter"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-orange-400 bg-orange-400 hover:scale-110 transition"
            >
              <FaTwitter className="text-[#FFF6EA]" />
            </button>
          </div>
        </div>
      </header>

      {/* Title & Wallet */}
      <section className="w-full flex justify-center mt-8 px-4">
        <div className="max-w-5xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                9BNB 
                <img 
                  src="/sheelsheep.jpg" 
                  alt="9BNB" 
                  className="inline-block h-8 md:h-10 lg:h-12 w-auto object-contain mx-3"
                />
                <span className="ml-2 text-xl md:text-2xl font-bold">
                  Presale
                </span>
              </h1>
              <p className="text-xs md:text-sm text-[#7D857F] mt-2">
                Min 0.05 BNB • Max 0.1 BNB • Target {target} BNB
                {!presaleActive && <span className="text-red-600 font-semibold ml-2">• INACTIVE</span>}
                {paused && <span className="text-yellow-600 font-semibold ml-2">• PAUSED</span>}
                {soldOut && <span className="text-red-600 font-semibold ml-2">• SOLD OUT</span>}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <ConnectButton />
              <div className="text-left sm:text-right">
                {isConnected && (
                  <>
                    <p className="text-xs text-[#6A6A6A]">
                      Bal: {balance?.format ?? "0.00"} {balance?.symbol ?? ""}
                    </p>
                    <p className="text-xs mt-1">
                      <span className={`font-semibold ${isWhitelisted ? 'text-green-600' : 'text-red-600'}`}>
                        {isWhitelisted ? '✅ Whitelisted' : '❌ Not Whitelisted'}
                      </span>
                    </p>
                    {userContributions > 0 && (
                      <p className="text-xs text-[#6A6A6A] mt-1">
                        Contributed: {userContributions.toFixed(4)} BNB
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presale Card */}
      <main className="flex-grow flex justify-center items-start px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 rounded-2xl shadow-xl p-6 md:p-10">
            {/* Progress Section */}
            <div className="flex flex-row items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#FFF6EA] flex items-center justify-center border shadow-inner">
                <img
                  src="/sheelsheep.jpg"
                  alt="9BNB logo"
                  className="w-14 h-14 object-cover rounded-md"
                />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center justify-between text-sm text-[#7D857F]">
                  <span>Raised</span>
                  <span>{raised.toFixed(4)} BNB</span>
                </div>

                <div className="mt-3 w-full bg-[#ECE6E7] h-4 rounded-full overflow-hidden">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#7D857F] mt-2 font-medium">
                  <span>0 BNB</span>
                  <span>{target} BNB</span>
                </div>
              </div>
            </div>

            {/* Input & Buy Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
              <div className="flex items-center gap-3 w-full">
                <input
                  type="number"
                  placeholder="Amount (BNB)"
                  className="flex-1 w-full px-4 py-3 rounded-lg border border-[#E6DFD4] bg-[#FEFBF8] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={handleBuy}
                  disabled={!isConnected || loading || !presaleActive || soldOut || paused || !isWhitelisted}
                  className="px-6 md:px-10 h-12 rounded-lg bg-[#0E1A2F] text-white font-bold hover:bg-[#152437] disabled:opacity-50"
                >
                  {loading ? "..." : 
                   !isConnected ? "CONNECT WALLET" :
                   !isWhitelisted ? "NOT WHITELISTED" :
                   !presaleActive ? "PRESALE INACTIVE" :
                   paused ? "PRESALE PAUSED" :
                   soldOut ? "SOLD OUT" : "BUY"}
                </button>
              </div>

              <div className="flex gap-3">
                {["0.05", "0.1", "Max"].map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAmount(val === "Max" ? "0.1" : val)}
                    className="px-5 py-2 rounded-lg bg-[#0E1A2F] text-white text-sm font-semibold hover:scale-105 transition"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip */}
            <p className="mt-4 text-xs text-[#9B9B9B] italic">
              Tip: Max = min(0.1, remaining to {target} BNB). Purchases below 0.05 are rejected. 
              {isConnected && !isWhitelisted && (
                <span className="text-red-600 font-semibold"> Your wallet must be whitelisted to participate.</span>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-orange-400 font-semibold italic">9BNB 2025</p>
      </footer>
    </div>
  );
}
