<script setup lang="ts">
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/solid";
import Button from "@toruslabs/vue-components/common/Button.vue";
import { CopyIcon } from "@toruslabs/vue-icons/basic";
import QRCodeVue3 from "qrcode-vue3";
import { ref } from "vue";

import SolanaLogoURL from "@/assets/solana-dark.svg";
import SolanaLightLogoURL from "@/assets/solana-light.svg";
import { copyText } from "@/utils/helpers";
import { getWhiteLabelLogoDark, getWhiteLabelLogoLight } from "@/utils/whitelabel";

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    publicAddress: string;
    description?: string;
    isDarkMode?: boolean;
  }>(),
  {
    isOpen: false,
    isDarkMode: false,
    description: "",
  }
);
const emits = defineEmits(["onClose"]);

const closeModal = () => {
  emits("onClose");
};

const refDiv = ref(null);

const copyPrivKey = () => {
  copyText(props.publicAddress || "");
};
</script>
<template>
  <TransitionRoot appear :show="props.isOpen" as="template">
    <Dialog ref="refDiv" :open="props.isOpen" :initial-focus="refDiv" as="div" :class="{ dark: isDarkMode }" @close="closeModal">
      <div class="fixed inset-0 z-30 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <DialogOverlay class="fixed inset-0 opacity-30 bg-gray-200 dark:bg-gray-600" />

          <span class="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div class="relative inline-block w-fit sm:w-128 align-middle transition-all bg-white dark:bg-app-gray-700 rounded-md shadow">
              <DialogTitle as="div" class="rounded-md flex justify-center py-8 relative" tabindex="0">
                <img
                  class="block h-4 w-auto"
                  :src="isDarkMode ? getWhiteLabelLogoLight() || SolanaLightLogoURL : getWhiteLabelLogoDark() || SolanaLogoURL"
                  alt="Solana Logo"
                />
                <XIcon class="w-6 h-6 absolute top-3 right-3 text-app-text-500 cursor-pointer" @click="closeModal" />
              </DialogTitle>

              <div class="flex flex-col justify-center items-center">
                <div class="text-xs flex flex-row w-full justify-center dark:text-white mt-4 pl-4 pr-4" style="margin-bottom: 20px">
                  <span class="break-all">
                    {{ props.publicAddress }}
                  </span>
                  <Button variant="text" @click="copyPrivKey()">
                    <CopyIcon class="w-4 h-4 ml-2" />
                    <!-- {{ t("walletSettings.clickCopy") }} -->
                  </Button>
                </div>
                <QRCodeVue3
                  :width="200"
                  :height="200"
                  :value="props.publicAddress"
                  :qr-options="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
                  :image-options="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
                  :dots-options="{
                    type: 'dots',
                    color: '#26249a',
                    gradient: {
                      type: 'linear',
                      rotation: 0,
                      colorStops: [
                        { offset: 0, color: '#26249a' },
                        { offset: 1, color: '#26249a' },
                      ],
                    },
                  }"
                  :background-options="{ color: '#ffffff' }"
                  :corners-square-options="{ type: 'dot', color: '#000000' }"
                  :corners-dot-options="{ type: undefined, color: '#000000' }"
                  file-ext="png"
                  :download="false"
                />
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
