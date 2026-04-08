<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from "@/store";
import type { Album } from '@/types';

const store = useStore()

const emit = defineEmits(['close'])
const props = defineProps<{
  album: Album
}>()

const score = ref(props.album.score ?? 0)
const isVisible = ref(false)

const submit = async (s: string) => {
  await store.updateScore(props.album.id, s)
  close()
}

const close = () => {
  isVisible.value = false
  setTimeout(() => emit('close'), 300)
}

const getColor = (s: string) => {
  let color = '#cccccc'
  if (s !== '-') {
    color = parseInt(s) > 4 ? parseInt(s) >= 8 ? 'oklch(79.2% 0.209 151.711)' : 'oklch(82.8% 0.189 84.429)' : 'oklch(64.5% 0.246 16.439)'
  }

  return { 
    'background': s === score.value ? 'white' : color,
    'color': s === score.value ? color : 'white',
    'border-color': color,
  }
}

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-white/80 flex flex-col justify-end transition-opacity duration-300" :class="isVisible ? 'opacity-100' : 'opacity-0'" @click.self="close">
    <transition name="sheet" appear>
      <div v-if="isVisible" class="pb-16 p-3 bg-white">
        <h2 class="font-bold text-xl leading-5 mb-3">{{ album.title }}
          <span class="font-normal text-lg">&bullet; {{ album.year }}</span>
        </h2>
        <div class="grid grid-cols-6 gap-1.5 w-full">
          <button v-for="s in ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']" :key="s" :style="getColor(s)" class="flex items-center justify-center gap-0.5 shadow font-bold border-2 text-xl w-full md:w-fit px-2 py-2 rounded-md transition-all bg-pink-300" @click="submit(s)">
            {{ s }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.sheet-enter-active, .sheet-leave-active {
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from, .sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.sheet-enter-to, .sheet-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>