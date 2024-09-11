import { ProviderConfig } from "@toruslabs/base-controllers";
import { SUPPORTED_NETWORKS } from "@toruslabs/solana-controllers";

export const WALLET_SUPPORTED_NETWORKS: { [key: string]: ProviderConfig } = {
  ...SUPPORTED_NETWORKS,
  mainnet: {
    ...SUPPORTED_NETWORKS.mainnet,
    rpcTarget: "https://lingering-proportionate-shape.solana-mainnet.quiknode.pro/333c99a51827513e9f2ee5ebd8154716724eb350",
    // rpcTarget: "https://nyc39.rpcpool.com",
  },
  testnet: {
    ...SUPPORTED_NETWORKS.testnet,
    rpcTarget: "https://ultra-damp-bird.solana-testnet.quiknode.pro/b1240036081a1d63254c1ca44b5554e77fc0e880",
  },
  devnet: {
    ...SUPPORTED_NETWORKS.devnet,
    rpcTarget: "https://solana-devnet.g.alchemy.com/v2/4dmJWhOKFGHJH_586DhFzon5CLEJUdU5",
  },
  invalid: {
    ...SUPPORTED_NETWORKS.devnet,
    displayName: "Network Error",
    chainId: "loading",
  },
};

export const solagramApiUrl = process.env.NODE_ENV === "development" ? "https://dev.solagram.com" : "https://solagram.com";
export const solagramVerifier = process.env.NODE_ENV === "development" ? "solagram-mainnet" : "solagram-mainnet-prod";

// testnet: {
//   blockExplorerUrl: "?cluster=testnet",
//   chainId: "0x2",
//   displayName: "Solana Testnet",
//   logo: "solana.svg",
//   rpcTarget: "https://spring-frosty-sky.solana-testnet.quiknode.pro/060ad86235dea9b678fc3e189e9d4026ac876ad4/",
//   ticker: "SOL",
//   tickerName: "Solana Token",
// },
