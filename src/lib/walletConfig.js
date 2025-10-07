import { http } from "wagmi";
import { mainnet, bsc, sepolia } from "wagmi/chains";
import { createClient } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "74ca59a446dd3f63262458b5d9426ebb";

// export default config
const newConfig = getDefaultConfig({
  appName: "Sheel Token",
  projectId,
  chains: [mainnet, bsc, sepolia],
  client({ chain }) {
    return createClient({ chain, transport: http()});
  },
});

export default newConfig;
