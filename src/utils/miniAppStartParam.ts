import bs58 from "bs58";
import log from "loglevel";

export interface SolanaWalletParams {
  method: "connect" | "signMessage" | "signTransaction" | "";
  nonce: string;
  data?: string;
}

export const decodeStartParam = (param?: string): Partial<SolanaWalletParams> & { path: string } => {
  if (!param) {
    return {
      path: "/wallet/home",
    };
  }
  try {
    const uint8Array = bs58.decode(param);

    const decoder = new TextDecoder();
    const str = decoder.decode(uint8Array);
    log.error(str);

    const data = JSON.parse(str) as SolanaWalletParams;

    switch (data.method) {
      case "connect":
        return {
          ...data,
          path: "/confirm_connect",
        };
      case "signMessage":
        return {
          ...data,
          path: "/confirm_message",
        };
      case "signTransaction":
        return {
          ...data,
          path: "/confirm_transaction",
        };
      default:
        return {
          ...data,
          path: "/wallet/home",
        };
    }
  } catch (error) {
    log.error(error, "parse mini app start param error");
    return {
      path: "/wallet/home",
    };
  }
};
