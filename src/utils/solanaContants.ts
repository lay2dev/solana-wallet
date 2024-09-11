import { Web3AuthOptions } from "@web3auth/node-sdk";
import { SolanaPrivKeyProviderConfig } from "@web3auth/solana-provider";

export const WEB3_AUTH_CONFIG: Web3AuthOptions = {
  clientId: "BOAJ1kWlMe3D1lOZldD_FpAFRQL-w3KR-TVhUZ7HaAAFVyr-PuOmPqCHZNrgiZV8IdmY-3uWLRjK_-24dhR_DQM",
  web3AuthNetwork: "sapphire_mainnet",
  usePnPKey: false,
};

export const SOLANA_PRIVATEKEY_PROVIDER_CONFIG: {
  config: SolanaPrivKeyProviderConfig;
} = {
  config: {
    chainConfig: {
      chainNamespace: "solana",
      chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
      rpcTarget: "https://lingering-proportionate-shape.solana-mainnet.quiknode.pro/333c99a51827513e9f2ee5ebd8154716724eb350",
      displayName: "Solana Mainnet",
      blockExplorerUrl: "https://explorer.solana.com",
      ticker: "SOL",
      tickerName: "Solana",
      logo: "https://images.toruswallet.io/solana.svg",
    },
  },
};
