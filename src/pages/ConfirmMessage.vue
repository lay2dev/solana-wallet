<script setup lang="ts">
import webApp from "@twa-dev/sdk";
import axios from "axios";
import log from "loglevel";
import { onMounted, reactive, ref } from "vue";

import FullDivLoader from "@/components/FullDivLoader.vue";
import Permissions from "@/components/permissions/Permissions.vue";

import ControllerModule, { torus } from "../modules/controllers";
import { solagramApiUrl } from "../utils/const";

const loading = ref(true);
interface MsgData {
  origin: string;
  message: string;
}
const msg_data = reactive<MsgData>({
  origin: "",
  message: "",
});

onMounted(async () => {
  try {
    const { data } = ControllerModule.solanaParams;

    msg_data.message = data || "";
    msg_data.origin = "https://www.solagram.com/" as string;
  } catch (error) {
    log.error(error, "error in tx");
  }
  loading.value = false;
});

const approveTxn = async (): Promise<void> => {
  const { nonce } = ControllerModule.solanaParams;
  loading.value = true;
  const res = await torus.signMessage(
    {
      params: {
        data: Buffer.from(msg_data.message, "hex"),
      },
      method: "sign_message",
    },
    true
  );
  await axios.get(`${solagramApiUrl}/solagram/api/v1/wallet/message`, {
    params: {
      nonce,
      data: Buffer.from(res).toString("hex"),
    },
  });
  loading.value = false;

  log.info({ signature: Buffer.from(res).toString("hex") });
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
  <FullDivLoader v-if="loading" />
  <Permissions v-else :requested-from="msg_data.origin" :approval-message="msg_data.message" @on-approved="approveTxn" @on-rejected="rejectTxn" />
</template>
