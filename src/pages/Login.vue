<script setup lang="ts">
import { LOGIN_PROVIDER, LOGIN_PROVIDER_TYPE } from "@toruslabs/openlogin-utils";
import webApp from "@twa-dev/sdk";
import { throttle } from "lodash-es";
import log from "loglevel";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { addToast } from "@/modules/app";
import { AVAILABLE_WEBSITES } from "@/utils/enums";

import FullDivLoader from "../components/FullDivLoader.vue";
import ControllerModule from "../modules/controllers";
import { decodeStartParam } from "../utils/miniAppStartParam";

webApp.ready();
webApp.expand();

const listOfChains = ref<{ value: string; label: string; img?: string; link?: string }[]>([
  {
    label: "Solana",
    value: "Solana",
    img: "icon-solana.svg",
    link: AVAILABLE_WEBSITES.Solana,
  },
]);
const selectedChain = ref(listOfChains.value[0]);

const router = useRouter();
const isLoading = ref(true);

// const hasSelectedPrivateKey = computed(() => ControllerModule.hasSelectedPrivateKey);
// const selectedAddress = computed(() => ControllerModule.selectedAddress);

const onLogin = async (loginProvider: LOGIN_PROVIDER_TYPE, emailString?: string) => {
  try {
    log.error(webApp.initDataUnsafe.start_param);
    const { path, method = "", data = "", nonce = "" } = decodeStartParam(webApp.initDataUnsafe.start_param);

    ControllerModule.setSolanaParams({
      method,
      data,
      nonce,
    });

    isLoading.value = true;
    await ControllerModule.triggerLogin({
      loginProvider,
      login_hint: emailString,
      waitSaving: false,
    });
    isLoading.value = false;
    router.push(path);
  } catch (error) {
    log.error(error);
    addToast({
      message: "Login failed. Please reload page.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  onLogin(LOGIN_PROVIDER.GOOGLE);
});

watch(
  selectedChain,
  throttle(() => {
    window.location.href = selectedChain.value.link || "";
  }, 500)
);
</script>

<template>
  <FullDivLoader v-if="isLoading" />
</template>
