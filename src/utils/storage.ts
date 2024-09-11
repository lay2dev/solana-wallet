import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaToken } from "@toruslabs/solana-controllers";
// import axios from "axios";
import log from "loglevel";

export class TokenListStorage {
  private readonly storageKey: string = "SLP_tokenList";

  // 保存Token List到localStorage
  saveTokenList(tokens: SolanaToken[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tokens));
  }

  // 从localStorage获取Token List
  getTokenList(): SolanaToken[] {
    const storedTokens = localStorage.getItem(this.storageKey);
    return storedTokens ? JSON.parse(storedTokens) : [];
  }

  // 更新Token List
  updateTokenList(updatedTokens: SolanaToken[]): void {
    this.saveTokenList(updatedTokens);
  }

  // 添加单个Token
  addToken(token: SolanaToken): void {
    const currentTokens = this.getTokenList();

    const existToken = currentTokens.find((t) => t.mintAddress === token.mintAddress);
    if (existToken) {
      return;
    }
    currentTokens.push(token);
    this.saveTokenList(currentTokens);
  }

  // 根据id删除Token
  removeToken(address: string): void {
    const currentTokens = this.getTokenList();
    const updatedTokens = currentTokens.filter((token) => token.mintAddress !== address);
    this.saveTokenList(updatedTokens);
  }

  // 清空Token List
  clearTokenList(): void {
    localStorage.removeItem(this.storageKey);
  }
}
export async function getSplTokenBalances(splTokenAddresses: string[], yourSolAddress: string) {
  log.info(splTokenAddresses, yourSolAddress);
  const connection = new Connection("https://lingering-proportionate-shape.solana-mainnet.quiknode.pro/333c99a51827513e9f2ee5ebd8154716724eb350"); // Replace with your desired network
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(yourSolAddress), {
      programId: TOKEN_PROGRAM_ID,
    });
    const tokenBalances = new Map<string, bigint>();

    // eslint-disable-next-line no-restricted-syntax
    for (const account of tokenAccounts.value) {
      // eslint-disable-next-line no-await-in-loop
      const accountData = await getAccount(connection, account.pubkey);
      if (splTokenAddresses.includes(accountData.mint.toBase58())) {
        tokenBalances.set(accountData.mint.toBase58(), accountData.amount);
      }
    }

    return tokenBalances;
  } catch (error) {
    log.error("Error fetching token balance:", error);
    return new Map<string, bigint>();
  }
}
