<script setup lang="ts">
import log from "loglevel";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import SplCard from "@/components/home/SplCard.vue";
import { tokens } from "@/components/transfer/token-helper";
import { HomePageInteractions, trackUserClick } from "@/directives/google-analytics";
import ControllerModule from "@/modules/controllers";

import { getSplTokenBalances } from "../utils/storage";

const router = useRouter();
const tokenList = computed(() => ControllerModule.slpTokenss);
const address = computed(() => ControllerModule.selectedAddress);

log.info(tokenList.value[0]);

onMounted(async () => {
  const balances = await getSplTokenBalances(
    tokenList.value.map((t) => t.mintAddress),
    address.value
  );

  const slpTokens: any = tokenList.value.map((token) => {
    const balance = balances.get(token.mintAddress) ? balances.get(token.mintAddress) : BigInt(0);

    const uiAmount = balance ? Number(balance) / 10 ** (token.data?.decimals || 0) : 0;

    return {
      ...token,
      balance: {
        amount: balance?.toString(),
        uiAmount,
        decimals: token.data?.decimals || 0,
        uiAmountString: uiAmount.toString(),
      },
    };
  });

  ControllerModule.updateSlpTokenss(slpTokens);
});

function transferToken(mint?: string) {
  trackUserClick(HomePageInteractions.SPL_TOKENS + (mint || ""));
  if (!mint) router.push("/wallet/transfer");
  else router.push(`/wallet/transfer?mint=${mint}`);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="tab-info w-full overflow-x-hidden">
      <div class="flex flex-col space-y-4">
        <div v-for="token in tokens" :key="token?.tokenAddress?.toString()" class="w-full">
          <SplCard :spl-token="token" @spl-clicked="transferToken(token.mintAddress)"></SplCard>
        </div>
        <template v-if="tokenList.length > 0">
          <div v-for="token in tokenList" :key="token?.tokenAddress?.toString()" class="w-full">
            <SplCard :spl-token="token" :spl-token-loading="false"></SplCard>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-info {
  height: fit-content;
}
</style>
