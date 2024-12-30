<script setup lang="ts">
import Stylus from '@/assets/stylus.svg'
import { IconDisc } from '@tabler/icons-vue'
</script>

<template>
  <div class="relative">
    <Stylus class="text-blue-600 absolute -top-0.5 left-[5px] z-50" />
    <IconDisc size="50" class="animate-spin text-green-400" />
  </div>
</template>