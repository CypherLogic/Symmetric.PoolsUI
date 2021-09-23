import { ContractKit, newKit } from '@celo/contractkit';
import {
  WalletConnectWallet,
  WalletConnectWalletOptions,
} from '@celo/wallet-walletconnect';

export default class Connector {
  public options: any;

  constructor(options: string) {
    this.options = options;
  }

  async connect() {
    return;
  }

  logout(): any {
    return true;
  }

  async isLoggedIn(): Promise<boolean> {
    return true;
  }
}
const getDeepLink = (uri: string) => {
  return `celo://wallet/wc?uri=${uri}`;
};
/**
 * ID of a Celo chain.
 */
export enum ChainId {
  Alfajores = 44787,
  Baklava = 62320,
  Mainnet = 42220,
}

export enum NetworkNames {
  Alfajores = 'Alfajores',
  Baklava = 'Baklava',
  Mainnet = 'Mainnet',
}

export const Mainnet = {
  name: NetworkNames.Mainnet,
  rpcUrl: 'https://forno.celo.org',
  graphQl: 'https://explorer.celo.org/graphiql',
  explorer: 'https://explorer.celo.org',
  chainId: ChainId.Mainnet,
} as const;

export const localStorageKeys = {
  lastUsedAddress: 'use-contractkit/last-used-address',
  lastUsedNetwork: 'use-contractkit/last-used-network',
  lastUsedWalletType: 'use-contractkit/last-used-wallet',
  lastUsedWalletArguments: 'use-contractkit/last-used-wallet-arguments',
};
/**
 * Network connection information.
 */
export interface Network {
  name: NetworkNames;
  rpcUrl: string;
  graphQl: string;
  explorer: string;
  chainId: ChainId;
}
export enum WalletTypes {
  Valora = 'Valora',
  // MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect'
  // CeloWallet = 'CeloWallet',
  // CeloTerminal = 'CeloTerminal',
  // CeloExtensionWallet = 'CeloExtensionWallet',
  // Ledger = 'Ledger',
  // Injected = 'Injected',
  // PrivateKey = 'PrivateKey',
  // Unauthenticated = 'Unauthenticated',
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface cConnector {
  kit: ContractKit;
  type: WalletTypes;
  account: string | null;

  initialised: boolean;
  initialise: () => Promise<this> | this;
  close: () => Promise<void> | void;

  onNetworkChange?: (callback: (chainId: number) => void) => void;
}
export class WalletConnectConnector implements cConnector {
  public initialised = false;
  public type = WalletTypes.WalletConnect;
  public kit: ContractKit;
  public account: string | null = null;

  private onUriCallback?: (uri: string) => void;
  private onCloseCallback?: () => void;

  constructor(
    network: Network,
    options: WalletConnectWalletOptions,
    readonly autoOpen = false,
    readonly getDeeplinkUrl?: (uri: string) => string
  ) {
    console.log('Constructing WalletConnect');
    console.log(network.rpcUrl);
    localStorage.setItem(
      localStorageKeys.lastUsedWalletType,
      WalletTypes.WalletConnect
    );
    localStorage.setItem(
      localStorageKeys.lastUsedWalletArguments,
      JSON.stringify(options)
    );
      console.log('WalletConnectConnector');
      console.log(options);
    const wallet = new WalletConnectWallet(options);
    console.log(wallet);
    console.log(network.rpcUrl);
    this.kit = newKit(network.rpcUrl, wallet);
  }

  onUri(callback: (uri: string) => void): void {
    this.onUriCallback = callback;
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  async initialise(): Promise<this> {
    const wallet = this.kit.getWallet() as WalletConnectWallet;
console.log('WALLETCONNECTWALLET: INITIALISED');
    if (this.onCloseCallback) {
      wallet.onPairingDeleted = () => this.onCloseCallback?.();
      wallet.onSessionDeleted = () => this.onCloseCallback?.();
    }

    const uri = await wallet.getUri();
    if (uri && this.onUriCallback) {
      this.onUriCallback(uri);
    }

    if (uri && this.autoOpen) {
      const deepLink = this.getDeeplinkUrl ? this.getDeeplinkUrl(uri) : uri;
      window.open(deepLink);
    }

    await wallet.init();
    const [defaultAccount] = wallet.getAccounts();
    this.kit.defaultAccount = defaultAccount;
    this.account = defaultAccount ?? null;

    return this;
  }

  close(): Promise<void> {
    const wallet = this.kit.getWallet() as WalletConnectWallet;
    return wallet.close();
  }
}
