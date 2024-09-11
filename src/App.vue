<script setup lang="ts">
import log from "loglevel";
import { onBeforeMount } from "vue";

import { Toast } from "@/components/common";

import ControllerModule from "./modules/controllers";
import { hideCrispButton } from "./utils/helpers";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

onBeforeMount(async () => {
  log.info(process.env.NODE_ENV);
  ControllerModule.setIsRehydrating(true);
  try {
    window.localStorage.removeItem("controllerModule");
    await sleep(300);
    ControllerModule.init({ origin: window.location.origin });
  } catch (error) {
    log.error(error);
  }
  ControllerModule.setIsRehydrating(false);

  // hide crispbutton on inital load
  hideCrispButton();
});
</script>

<template>
  <div :class="{ dark: ControllerModule.isDarkMode }" class="height-full font-body">
    <router-view />
    <Toast />
  </div>
</template>
