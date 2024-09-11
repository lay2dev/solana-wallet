<script setup lang="ts">
import webApp from "@twa-dev/sdk";
import axios from "axios";
import log from "loglevel";
import { onMounted, ref } from "vue";

import FullDivLoader from "@/components/FullDivLoader.vue";
import { useEstimateChanges } from "@/components/payments/EstimateChangesComposable";
import PermissionsTx from "@/components/permissionsTx/PermissionsTx.vue";
import { decodeAllInstruction, DecodedDataType } from "@/utils/instructionDecoder";

import ControllerModule, { torus } from "../modules/controllers";
import { solagramApiUrl } from "../utils/const";

const loading = ref(false);
const decodedInst = ref<DecodedDataType[]>();
const txHex = ref<string>("");
const { hasEstimationError, estimatedBalanceChange, estimationInProgress } = useEstimateChanges();

onMounted(async () => {
  try {
    const { nonce } = ControllerModule.solanaParams;

    log.info(nonce);

    const { data: resData } = await axios.get(`${solagramApiUrl}/solagram/api/v1/app/query`, {
      params: {
        key: nonce,
        walletType: 0,
        messageType: 1,
      },
    });

    let { data } = resData.data;

    data = Buffer.from(data as string, "base64").toString("hex");

    const decoded = await decodeAllInstruction([data as string], false, torus.connection);
    log.info(data);
    log.info(decoded);
    decodedInst.value = decoded;
    txHex.value = data;
  } catch (error) {
    log.error(error, "error in tx");
  }
});

const approveTxn = async (): Promise<void> => {
  const { nonce } = ControllerModule.solanaParams;
  log.info(txHex.value);
  loading.value = true;
  const signatures = await torus.UNSAFE_signAllTransactions({
    params: { message: [txHex.value] },
    method: "sign_all_transactions",
  });

  await axios.get(`${solagramApiUrl}/solagram/api/v1/wallet/message`, {
    params: {
      nonce,
      data: signatures?.[0] || "",
    },
  });

  loading.value = false;

  log.info(JSON.stringify({ sig: signatures?.[0], nonce }));
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
  <PermissionsTx
    v-else-if="decodedInst"
    :decoded-inst="decodedInst || []"
    :origin="'https://www.solagram.com'"
    :network="'mainnet'"
    :estimation-in-progress="estimationInProgress"
    :estimated-balance-change="estimatedBalanceChange"
    :has-estimation-error="hasEstimationError"
    @on-approved="approveTxn()"
    @on-cancel="rejectTxn()"
  />
</template>
