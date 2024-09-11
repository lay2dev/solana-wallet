<script setup lang="ts">
import { GlobeIcon, OptionsIcon } from "@toruslabs/vue-icons/basic";
import { LockIcon } from "@toruslabs/vue-icons/security";

import { Panel } from "@/components/common";
import { AccountDetails, Display, Network } from "@/components/settings";
</script>

<template>
  <div class="py-2">
    <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
      <div>
        <div class="mb-4">
          <Panel :title="'Privacy Security'" disabled>
            <AccountDetails />
            <template #leftIcon><LockIcon class="w-5 h-5 mr-2 text-app-text-600 dark:text-app-text-dark-500" /></template>
          </Panel>
        </div>
      </div>
      <div>
        <div class="mb-4">
          <Panel :title="'Network'" disabled>
            <Network />
            <template #leftIcon><GlobeIcon class="w-5 h-5 mr-2 text-app-text-600 dark:text-app-text-dark-500" /></template>
          </Panel>
        </div>
        <div class="mb-4">
          <Panel :title="'Display'" disabled>
            <Display />
            <template #leftIcon><OptionsIcon class="w-5 h-5 mr-2 text-app-text-600 dark:text-app-text-dark-500" /></template>
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>
