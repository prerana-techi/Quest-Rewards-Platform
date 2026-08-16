import { rpc, Keypair, Contract, Address, scValToNative, nativeToScVal, xdr, TransactionBuilder, Account, Horizon } from '@stellar/stellar-sdk';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';

export class StellarRpcService {
  private server: rpc.Server;
  private networkPassphrase: string;
  private horizonServer: Horizon.Server;

  constructor(
    rpcUrl: string = DEFAULT_NETWORK_CONFIG.rpcUrl,
    networkPassphrase: string = DEFAULT_NETWORK_CONFIG.networkPassphrase
  ) {
    this.server = new rpc.Server(rpcUrl);
    this.networkPassphrase = networkPassphrase;
    this.horizonServer = new Horizon.Server(
      rpcUrl.includes('testnet') ? 'https://horizon-testnet.stellar.org' : 'https://horizon.stellar.org'
    );
  }

  public getServer(): rpc.Server {
    return this.server;
  }

  public getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }

  /**
   * Fetch latest ledger sequence
   */
  public async getLatestLedger(): Promise<number> {
    try {
      const info = await this.server.getLatestLedger();
      return info.sequence;
    } catch (e) {
      console.warn('RPC getLatestLedger failed, falling back to Horizon', e);
      const ledger = await this.horizonServer.ledgers().order('desc').limit(1).call();
      return ledger.records[0]?.sequence || 1000000;
    }
  }

  /**
   * Fetch account balance in XLM
   */
  public async getAccountBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.horizonServer.loadAccount(publicKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      return nativeBalance ? nativeBalance.balance : '0.00';
    } catch {
      return '0.00';
    }
  }

  /**
   * Poll transaction status until confirmed or max timeout
   */
  public async pollTxStatus(hash: string, maxAttempts = 15, delayMs = 1500): Promise<rpc.Api.GetTransactionResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await this.server.getTransaction(hash);
        if (res.status === 'SUCCESS' || res.status === 'FAILED') {
          return res;
        }
      } catch (e) {
        console.log(`Polling tx ${hash} attempt ${i + 1}/${maxAttempts}...`);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    throw new Error(`Transaction ${hash} confirmation timed out.`);
  }

  /**
   * Request friendbot testnet XLM funding
   */
  public async requestFriendbot(publicKey: string): Promise<boolean> {
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      return res.ok;
    } catch (e) {
      console.error('Friendbot request failed', e);
      return false;
    }
  }
}

export const stellarRpc = new StellarRpcService();
