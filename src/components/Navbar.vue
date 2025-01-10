<script setup lang="ts">
import { IconMusicHeart, IconSearch, IconBackspace } from '@tabler/icons-vue'
import { computed, ref } from "vue";
import { useStore } from "@/store";

const emit = defineEmits(['activeYear', 'activeGold']);
const search = defineModel({ type: String, default: '' })

const store = useStore()

const activeFilter = ref(-1)
const activeGold = ref(false)

const setActiveFilter = (filter: string | number) => {
  if (filter === 'gold') {
    activeGold.value = !activeGold.value
    emit('activeGold', activeGold.value)
    return
  }

  activeFilter.value = activeFilter.value === filter ? -1 : filter as number
  emit('activeYear', activeFilter.value)
}

const tenOutOfTenRatio = computed(() => Math.round(store.listened.reduce((acc, album) => album.score === '10' ? acc + 1 : acc, 0) / store.listened.length * 100) || 0)
</script>

<template>
  <nav class="p-2 grid md:flex items-center md:justify-between">
    <div class="flex items-center gap-6">
      <h1 class="flex items-center gap-2 text-2xl">
        <IconMusicHeart size="30" class="text-rose-500" />
        <span class="hidden md:block text-amber-950">Music Heart</span>
      </h1>

      <div class="flex items-center text-amber-950 w-full md:w-fit">
        <IconSearch size="20" :class="[search.length ? 'text-rose-500' : 'text-amber-950/50', 'mr-1']" />
        <input v-model="search" placeholder="Search..." class="focus:outline-none bg-amber-50 placeholder-amber-950/50 w-full">
        <button v-if="search.length" @click="search = ''" class="focus:outline-none">
          <IconBackspace class="text-rose-500 hover:opacity-60" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between md:justify-end mt-2 md:mt-0 gap-1.5">
      <button :class="[activeGold ? 'ring-amber-400 ring-2' : '', 'bg-amber-400 flex items-center gap-0.5 text-nowrap text-amber-50 px-2 py-1 rounded-md border-amber-50 border-2 hover:opacity-70 transition-all']" @click="setActiveFilter('gold')">
        <span>{{ tenOutOfTenRatio }} %</span>
      </button>
      <button v-for="years in ['1', '0', '9', '8', '7', '6']" :key="years" :class="[activeFilter === years ? 'bg-amber-950 border-amber-50 !text-amber-50' : '', 'flex items-center justify-center gap-0.5 font-medium w-full md:w-fit text-amber-950 px-2 py-0.5 rounded-md border-amber-950 border-2 hover:opacity-70 transition-all']" @click="setActiveFilter(years)">
        <span>{{ years }}0</span>
      </button>
    </div>
  </nav>
</template>