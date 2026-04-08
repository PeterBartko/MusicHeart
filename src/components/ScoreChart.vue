<script lang="ts" setup>
import { useStore } from '@/store';
import { computed } from 'vue';

const emit = defineEmits(['close'])

const store = useStore()

const getColor = (score: number) => score > 4 ? score >= 8 ? 'oklch(79.2% 0.209 151.711)' : 'oklch(82.8% 0.189 84.429)' : 'oklch(64.5% 0.246 16.439)'

const scoreDistribution = computed(() => {
  const listened = store.listened || [];
  const total = listened.length;

  const counts = Array.from({ length: 11 }, (_, i) => {
    return listened.filter(a => parseInt(a.score) === i).length;
  });

  const maxCount = Math.max(...counts);

  return counts.map((count, i) => {
    return {
      score: i,
      count: count,
      totalPercentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      relativeHeight: maxCount > 0 ? ((count / maxCount) * 100).toFixed(1) : 0
    };
  });
});
</script>

<template>
  <transition appear>
    <div class="fixed inset-0 z-[9999] bg-white/80 backdrop-blur grid place-items-center" @click="emit('close')">
      <div class="bg-whites rounded-md w-[90%]">
        <div class="grid grid-cols-11 items-end gap-1.5 w-full h-[300px]">
          <div v-for="bar in scoreDistribution" :key="bar.score" :style="{ height: `${bar.relativeHeight}%`, background: getColor(bar.score) }" class="rounded shadow relative">
            <div class="font-bold text-xs absolute -top-4 right-1/2 translate-x-1/2">{{ bar.totalPercentage }}%</div>
          </div>
        </div>
        <div class="grid grid-cols-11 gap-1.5 mt-1">
          <div v-for="bar in scoreDistribution" :key="bar.score" class="text-center font-bold text-xl">{{ bar.score }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>
