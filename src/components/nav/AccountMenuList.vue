<script setup lang="ts">
import { UserInfo } from "@toruslabs/base-controllers";
import { WalletIcon } from "@toruslabs/vue-icons/finance";

import solicon from "@/assets/solana-logo-light.svg";
import ControllerModule from "@/modules/controllers";

defineProps<{
  user: UserInfo;
  selectedAddress: string;
}>();

// const logout = () => {
//   emits("onLogout");
// };
</script>

<template>
  <div>
    <div class="flex items-center p-4">
      <img class="rounded-full w-10 mr-2" :src="user.profileImage || solicon" alt="" />
    </div>
    <div class="px-3 pb-3">
      <div class="flex">
        <div class="flex items-center">
          <WalletIcon class="w-4 h-4 mr-1 text-app-text-500 dark:text-app-text-dark-500" />
          <div class="font-bold text-sm text-app-text-600 dark:text-app-text-dark-500">
            {{ ControllerModule.selectedAddress }}
          </div>
        </div>
      </div>
    </div>

    <!-- <div
    class="
      flex
      cursor-pointer
      items-center
      border-t border-b
      sm:border-b-0
      w-full
      text-left
      px-4
      py-4
      text-sm
      font-bold
      text-app-text-600
      dark:text-app-text-dark-500 dark:hover:text-app-text-600 dark:hover:bg-app-gray-400
    "
  >
    <InformationCircleIcon class="w-4 h-4 mr-2" aria-hidden="true" />
    <div>Info and Support</div>
  </div> -->
  </div>
</template>

<style scoped></style>
