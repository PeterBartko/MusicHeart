<script setup lang="ts">
import Stylus from '@/assets/stylus.svg'
import { IconDisc } from '@tabler/icons-vue'
</script>

<template>
  <div class="relative">
    <Stylus class="text-rose-500 absolute -top-1 left-[13px] z-50" />
    <IconDisc size="70" class="animate-spin text-blue-500" />
  </div>
</template>