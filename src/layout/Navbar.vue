<script setup lang="ts">
import { IconSearch, IconX } from '@tabler/icons-vue'
import { watch, ref } from "vue";
import { useStore } from "@/store.ts";
import Logo from '@/components/Logo.vue';
import ScoreChart from '@/components/ScoreChart.vue';

const store = useStore()

const showStats = ref(false)

const setActiveYears = (years: string) => {
  store.activeYear = store.activeYear === years ? '-1' : years
}

const setActiveScore = (score: number) => {
  store.activeScore = score === store.activeScore ? 0 : score
}

const closefilter = () => {
  store.search = ''
  store.showFilter = false
}

const getColor = (score: number) => {
  const color = score > 4 ? score >= 8 ? 'oklch(79.2% 0.209 151.711)' : 'oklch(82.8% 0.189 84.429)' : 'oklch(64.5% 0.246 16.439)'

  return { 
    'background': score === store.activeScore ? 'white' : color,
    'border-color': color,
    'color': score === store.activeScore ? color : 'white',
  }
}

watch([() => store.activeScore, () => store.activeYear], () => {
  if (!store.activeScore && store.activeYear === '-1') {
    store.showFilter = false
  }
})
</script>

<template>
  <nav class="px-2 grid sm:flex sm:flex-col sitems-center sm:justify-between fixed top-0 right-0 left-0 z-[9999] bg-white">
    <div class="flex items-center gap-3">
      <h1 class="flex items-center gap-1 text-2xl">
        <Logo :size="32" @click="showStats = true" />
        <span :class="[$route.name === 'list' && 'hidden sm:block', 'text-black']">MusicHeart</span>
      </h1>

      <div v-if="$route.name === 'list'" class="flex items-center text-black w-full ssm:w-fit">
        <IconSearch size="20" :class="[store.search.length ? 'text-rose-500' : 'text-black/50', 'mr-1']" />
        <input v-model="store.search" @focus="store.showFilter = true" enterkeyhint="search" placeholder="Search..." class="focus:outline-none placeholder-zinc-950/50 bg-transparent w-full">
        <button v-if="store.showFilter" @click="closefilter" class="focus:outline-none">
          <IconX class="text-rose-500 hover:opacity-60" />
        </button>
      </div>
    </div>

    <div v-if="store.showFilter" class="pb-2 sm:flex sm:flex-row-reverse sm:justify-between sm:mt-2">
      <div class="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 gap-1.5">
        <button v-for="years in ['2', '1', '0', '9', '8', '7', '6']" :key="years" :class="[store.activeYear === years ? 'border-blue-500 text-blue-500' : 'bg-blue-500 border-blue-500 text-white', 'flex items-center justify-center gap-0.5 font-bold w-full sm:w-fit px-2 py-0.5 rounded-md shadow border-2 hover:opacity-70 transition-all']" @click="setActiveYears(years)">
          {{ years }}0s
        </button>
      </div>
      <div class="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 gap-1.5">
        <button v-for="score in [4, 5, 6, 7, 8, 9, 10]" :key="score" :style="getColor(score)" class="flex items-center sm:min-w-10 justify-center gap-0.5 font-bold w-full sm:w-fit px-2 py-0.5 rounded-md shadow border-2 transition-all" @click="setActiveScore(score)">
          {{ score === 4 ? '0-4' : score }}
        </button>
      </div>
    </div>
  </nav>

  <transition name="fade">
    <ScoreChart v-if="showStats" @close="showStats = false" />
  </transition>
</template>
