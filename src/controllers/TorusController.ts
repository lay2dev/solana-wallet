import {
  BaseController,
  createLoggerMiddleware,
  createOriginMiddleware,
  providerAsMiddleware,
  ProviderConfig,
  // SafeEventEmitterProvider,
} from "@toruslabs/base-controllers";
import {
  AccountTrackerController,
  CurrencyController,
  IProviderHandlers,
  KeyringController,
  NetworkController,
  PreferencesController,
  SUPPORTED_NETWORKS,
} from "@toruslabs/casper-controllers";
import { createEngineStream, JRPCEngine, Substream } from "@toruslabs/openlogin-jrpc";
import { GetDeployResult } from "casper-js-sdk";
import log from "loglevel";

import config from "@/config";
import { TorusControllerConfig, TorusControllerState } from "@/utils/enums";

// import { debounce, DebouncedFunc } from "lodash";
import { PKG } from "../const";

export const DEFAULT_CONFIG = {
  CurrencyControllerConfig: { api: config.api, pollInterval: 600_000 },
  NetworkControllerConfig: { providerConfig: SUPPORTED_NETWORKS["casper_mainnet"] },
  PreferencesControllerConfig: { pollInterval: 180_000 },
};

export const DEFAULT_STATE = {
  AccountTrackerState: { accounts: {} },
  KeyringControllerState: { wallets: [] },
  CurrencyControllerState: {
    conversionDate: Date.now().toString(),
    conversionRate: 0,
    currentCurrency: "usd",
    nativeCurrency: "cspr",
    ticker: "cspr",
  },
  NetworkControllerState: {
    chainId: SUPPORTED_NETWORKS["casper_mainnet"].chainId,
    properties: {},
    providerConfig: SUPPORTED_NETWORKS["casper_mainnet"],
  },
  PreferencesControllerState: {
    identities: {},
    selectedAddress: "",
  },
};

export default class TorusController extends BaseController<TorusControllerConfig, TorusControllerState> {
  private networkController!: NetworkController;
  private currencyController!: CurrencyController;
  private accountTracker!: AccountTrackerController;
  private keyringController!: KeyringController;
  private prefsController!: PreferencesController;
  private engine?: JRPCEngine;

  //   private sendUpdate: DebouncedFunc<() => void>;

  constructor({ config, state }: { config: Partial<TorusControllerConfig>; state: Partial<TorusControllerState> }) {
    super({ config, state });
  }

  /**
   * Always call init function before using this controller
   */
  public init({ config, state }: { config: Partial<TorusControllerConfig>; state: Partial<TorusControllerState> }): void {
    log.info(config, state, "restoring config & state");
    this.initialize();
    this.configure(config, true, true);
    this.update(state, true);
    this.networkController = new NetworkController({ config: this.config.NetworkControllerConfig, state: this.state.NetworkControllerState });

    this.initializeProvider();

    this.currencyController = new CurrencyController({
      config: this.config.CurrencyControllerConfig,
      state: this.state.CurrencyControllerState,
    });
    this.currencyController.updateConversionRate();
    this.currencyController.scheduleConversionInterval();

    // key mgmt
    this.keyringController = new KeyringController({
      config: this.config.KeyringControllerConfig,
      state: this.state.KeyringControllerState,
    });

    this.prefsController = new PreferencesController({
      state: this.state.PreferencesControllerState,
      config: this.config.PreferencesControllerConfig,
    });

    this.accountTracker = new AccountTrackerController({
      provider: this.networkController._providerProxy,
      state: this.state.AccountTrackerState,
      config: this.config.AccountTrackerConfig,
      blockTracker: this.networkController._blockTrackerProxy,
      getIdentities: () => this.prefsController.state.identities,
      onPreferencesStateChange: (listener) => this.prefsController.subscribe(listener),
      onNetworkChange: (listener) => this.networkController.subscribe(listener),
    });

    // ensure accountTracker updates balances after network change
    this.networkController.subscribeEvent("networkDidChange", () => {
      this.accountTracker.refresh();
    });

    this.networkController.lookupNetwork();

    // Listen to controller changes
    this.prefsController.subscribe((state) => {
      this.update({ PreferencesControllerState: state });
    });

    this.currencyController.subscribe((state) => {
      this.update({ CurrencyControllerState: state });
    });

    this.networkController.subscribe((state) => {
      this.update({ NetworkControllerState: state });
    });

    this.accountTracker.subscribe((state) => {
      this.update({ AccountTrackerState: state });
    });

    this.keyringController.subscribe((state) => {
      this.update({ KeyringControllerState: state });
    });

    // ensure isClientOpenAndUnlocked is updated when memState updates
    // this.subscribeEvent("update", (torusControllerState: unknown) => this._onStateUpdate(torusControllerState));

    // this.subscribe(this.sendUpdate.bind(this));

    // if (typeof options.rehydrate === "function") {
    //   setTimeout(() => {
    //     options.rehydrate();
    //   }, 50);
    // }
    // this.sendUpdate = debounce(this.privateSendUpdate.bind(this), 200);
  }

  private initializeProvider() {
    const providerHandlers: IProviderHandlers = {
      version: PKG.version,
      // account mgmt
      // TODO: once embed structure is defined
      requestAccounts: async () => (this.prefsController.state.selectedAddress ? [this.prefsController.state.selectedAddress] : []),

      getAccounts: async () =>
        // Expose no accounts if this origin has not been approved, preventing
        // account-requiring RPC methods from completing successfully
        // only show address if account is unlocked
        this.prefsController.state.selectedAddress ? [this.prefsController.state.selectedAddress] : [],
      // tx signing
      processDeploy: async () => {
        return { deploy_hash: "" };
      }, // todo: add handler for tx processing
      getPendingDeployByHash: async () => {
        return {} as unknown as GetDeployResult;
      },
    };
    const providerProxy = this.networkController.initializeProvider(providerHandlers);
    return providerProxy;
  }

  //   private isUnlocked(): boolean {
  //     return !!this.prefsController.state.selectedAddress;
  //   }
  /**
   * A method for emitting the full torus controller state to all registered listeners.
   * @private
   */
  //   private privateSendUpdate(): void {
  //     this.notifyEvent("update", this.state);
  //   }

  /**
   * Handle memory state updates.
   * - Ensure isClientOpenAndUnlocked is updated
   * - Notifies all connections with the new provider network state
   *   - The external providers handle diffing the state
   */
  //   private _onStateUpdate() {
  //     this.notifyAllConnections({
  //       method: NOTIFICATION_NAMES.chainChanged,
  //       params: this.getProviderNetworkState(newState),
  //     });
  //   }

  /**
   * Causes the RPC engines associated with all connections to emit a
   * notification event with the given payload.
   *
   * The caller is responsible for ensuring that only permitted notifications
   * are sent.
   *
   * @param {any} payload - The event payload, or payload getter function.
   */
  //   private notifyAllConnections(payload: unknown) {
  //     const getPayload = () => payload;
  //     if (this.engine) {
  //       this.engine.emit("notification", getPayload());
  //     }
  //   }

  async addAccount(privKey: string): Promise<string> {
    const address = this.keyringController.importAccount(privKey);
    await this.prefsController.init(address);
    return address;
  }

  setSelectedAccount(address: string): void {
    this.prefsController.setSelectedAddress(address);
  }

  /**
   * Used to create a multiplexed stream for connecting to an untrusted context
   * like a Dapp or other extension.
   */
  setupUntrustedCommunication(connectionStream: Substream, originDomain: string): void {
    // connect features && for test cases
    this.setupProviderConnection(connectionStream, originDomain);
  }

  /**
   * A method for serving our ethereum provider over a given stream.
   */
  setupProviderConnection(outStream: Substream, sender: string): void {
    // break violently
    const senderUrl = new URL(sender);

    const engine = this.setupProviderEngine({ origin: senderUrl.hostname });
    this.engine = engine;

    // setup connection
    const providerStream = createEngineStream({ engine });

    outStream
      .pipe(providerStream)
      .pipe(outStream)
      .on("error", (error: Error) => {
        // cleanup filter polyfill middleware
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        engine._middleware.forEach((mid) => {
          if (mid.destroy && typeof mid.destroy === "function") {
            mid.destroy();
          }
        });
        this.engine = undefined;
        if (error) log.error(error);
      });
  }

  /**
   * A method for creating a provider that is safely restricted for the requesting domain.
   * */
  setupProviderEngine({ origin }: { origin: string }): JRPCEngine {
    // setup json rpc engine stack
    const engine = new JRPCEngine();
    const { _providerProxy } = this.networkController;

    // create subscription polyfill middleware
    // const subscriptionManager = createSubscriptionManager({ provider, blockTracker });
    // subscriptionManager.events.on("notification", (message) => engine.emit("notification", message));

    // metadata
    engine.push(createOriginMiddleware({ origin }));
    engine.push(createLoggerMiddleware({ origin }));

    // TODO
    // engine.push(
    //   createMethodMiddleware({
    //     origin,
    //     getProviderState: this.getProviderState.bind(this),
    //     getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
    //   })
    // );

    // filter and subscription polyfills
    // engine.push(subscriptionManager.middleware);
    // forward to metamask primary provider
    engine.push(providerAsMiddleware(_providerProxy));
    return engine;
  }

  async setCurrentCurrency(currency: string): Promise<void> {
    const { ticker } = this.networkController.getProviderConfig();
    // This is CSPR
    this.currencyController.setNativeCurrency(ticker);
    // This is USD
    this.currencyController.setCurrentCurrency(currency);
    await this.currencyController.updateConversionRate();
    // TODO: store this in prefsController
  }

  setNetwork(providerConfig: ProviderConfig): void {
    this.networkController.setProviderConfig(providerConfig);
  }
}