import { http } from "wagmi";
import { mainnet, bsc } from "wagmi/chains";
import { createClient } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
const projectId = "05ea4a9903233202a47d6c2c6e8643af";

// export default config

const newConfig = getDefaultConfig({
  appName: "Sheel",
  projectId,
  chains: [mainnet, bsc],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

export default newConfig;
