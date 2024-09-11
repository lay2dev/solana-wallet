<script setup lang="ts">
import webApp from "@twa-dev/sdk";
import axios from "axios";
import log from "loglevel";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import SolanaLogoURL from "@/assets/solana-mascot.svg";
import { Button } from "@/components/common";
import FullDivLoader from "@/components/FullDivLoader.vue";
import { getWhiteLabelLogoDark, getWhiteLabelLogoLight } from "@/utils/whitelabel";

import ControllerModule, { torus } from "../modules/controllers";
import { solagramApiUrl } from "../utils/const";

const { t } = useI18n();
const loading = ref(false);

const approveTxn = async (): Promise<void> => {
  const { nonce } = ControllerModule.solanaParams;
  loading.value = true;
  const address = torus.selectedAddress;

  await axios.get(`${solagramApiUrl}/solagram/api/v1/wallet/message`, {
    params: {
      nonce,
      data: address,
    },
  });
  loading.value = false;

  log.info({ address, nonce });
  webApp.close();
};

const rejectTxn = async () => {
  loading.value = true;
  const { nonce } = ControllerModule.solanaParams;
  await axios.get(`${solagramApiUrl}/solagram/api/v1/wallet/message`, {
    params: {
      nonce,
      data: "",
      errorCode: 4001,
      errorMessage: "User Rejected Request",
    },
  });
  webApp.close();
};
</script>

<template>
  <FullDivLoader v-if="loading" class="absolute" />
  <div
    v-else
    class="w-full h-full overflow-hidden text-left align-middle transition-all bg-white dark:bg-app-gray-800 shadow-xl flex flex-col justify-center items-center"
  >
    <div class="content-box w-full h-full transition-all bg-white dark:bg-app-gray-800 shadow-xl flex flex-col relative">
      <div class="shadow dark:shadow-dark bg-white dark:bg-app-gray-700 text-center py-6 flex flex-row justify-start items-center px-4">
        <img
          class="h-7 left-5 absolute"
          :src="(ControllerModule.isDarkMode ? getWhiteLabelLogoLight() : getWhiteLabelLogoDark()) || SolanaLogoURL"
          alt="Dapp Logo"
        />
        <p class="text-center font-header text-lg font-bold text-app-text-600 dark:text-app-text-dark-500 w-full">Connect</p>
      </div>
      <div class="mt-4 items-center px-4 flex flex-col justify-start w-full">
        <div class="flex flex-col justify-start items-start w-full">
          <div class="w-full bg-white dark:bg-app-gray-700 h-12 mt-3 rounded-md approval-msg">
            <p class="whitespace-pre-line break-all text-sm text-app-text-600 dark:text-app-text-dark-500 m-4">
              {{ torus.selectedAddress }}
            </p>
          </div>
        </div>
      </div>
      <hr class="mx-6 mt-auto" />
      <div class="flex flex-row items-center my-4 mx-4">
        <Button class="flex-auto mx-1" :block="true" variant="tertiary" @click="rejectTxn">{{ t("dappTransfer.cancel") }}</Button>
        <Button class="flex-auto mx-1" :block="true" variant="primary" @click="approveTxn">{{ t("dappTransfer.approve") }}</Button>
      </div>
    </div>
  </div>
</template>
<style scoped>
hr {
  border-color: #555555;
}
.approval-msg {
  overflow: auto;
  height: 100%;
  max-height: 180px !important;
  min-height: 180px;
}

@screen gt-xs {
  .content-box {
    max-width: 400px;
    max-height: 600px;
  }
}
</style>
