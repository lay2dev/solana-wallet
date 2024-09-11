<script setup lang="ts">
import { Button } from "@/components/common";
import { SettingsPageInteractions } from "@/directives/google-analytics";
import ControllerModule from "@/modules/controllers";
</script>
<template>
  <div class="pb-4">
    <div class="grid grid-cols-2 space-x-3">
      <div>
        <Button
          v-ga="SettingsPageInteractions.DISPLAY + 'light'"
          class="w-full"
          :variant="ControllerModule.isDarkMode ? 'tertiary' : 'primary'"
          :block="true"
          @click="ControllerModule.changeTheme('light')"
          >{{ "Light" }}</Button
        >
      </div>
      <div>
        <Button
          v-ga="SettingsPageInteractions.DISPLAY + 'dark'"
          :variant="ControllerModule.isDarkMode ? 'primary' : 'tertiary'"
          :block="true"
          class="w-full"
          @click="ControllerModule.changeTheme('dark')"
          >{{ "Dark" }}</Button
        >
      </div>
    </div>
  </div>
</template>
