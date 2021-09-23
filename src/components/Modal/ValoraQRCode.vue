<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <div v-if="!web3.account || step === 'connect'">
      VALORA:
      <div class="m-4 mb-5">
          {{ uri }}
        <vue-qrcode
          :value="uri"
          :options="{ width: 200 }"
        ></vue-qrcode>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import {
  NetworkNames,
  WalletConnectConnector,
  getDeepLink,
  Mainnet,
} from '../../connector';

export default {
  props: ['open'],
  components: {
    VueQrcode
  },
  data() {
    return {
      step: null,
      value: 'https://example.com',
      size: 300,
      uri: null,
    };
  },
  mounted() {
   const URI = this.getUri();
   console.log(`URI: ${URI}`);
  },
  watch: {
    open() {
      this.step = null;
    }
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    },
    getUri(){
     return this.useWalletConnectConnector(true, 'celo://wallet/wc?uri=');
    },
    useWalletConnectConnector(autoOpen, getDeeplinkUrl) {
      //   const {
      //     network,
      //     dapp,
      //     destroy,
      //     initConnector
      //   } = useInternalContractKit();
      const [uri, setUri] = '';
      const initialiseConnection = async () => {
        const isMainnet = true; // network.name === Mainnet.name;
        console.log('initialiseConnection');
        const relayProvider = isMainnet
          ? 'wss://walletconnect.celo.org'
          : 'wss://walletconnect.celo-networks-dev.org';
          console.log('relayProvider');
          console.log(`DeepLink: ${NetworkNames.Mainnet}`);
        const connector = new WalletConnectConnector(
          Mainnet,
          {
            connect: {
              metadata: {
                name: 'Symmetric',
                description: 'SYMM Description',
                url: 'http://localhost:8080/',
                icons: [
                  'https://xdai-pools.symmetric.exchange/img/symmetricIcon.ad634ddf.svg'
                ]
              }
            },
            init: {
              relayProvider,
              logger: 'error'
            }
          },
          autoOpen && isMainnet
        );
        console.log('Connector:');
        console.log(connector);
        connector.initialise().then(value => {
            console.log('connector initialised.....');
            console.log(value)
        })
        connector.onUri(newUri => {
          //   if (mounted) {
          //     setUri(newUri);
          //   }
          console.log(`New URI RECD: ${newUri}`);
          this.uri = getDeeplinkUrl + newUri;
          return this.uri;
        });
        connector.onClose(() => {
          console.log('Connector.onClose()');
        });
        // await initConnector(connector);
        // onSubmit(connector);
      };

      initialiseConnection()
        .then(() => console.info('WalletConnect connection initialised'))
        // TODO surface error to user here
        .catch(reason =>
          console.error('Failed to initialise WalletConnect connection', reason)
        );
      return uri;
    }
  }
};
</script>
