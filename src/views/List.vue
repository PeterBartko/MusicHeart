<script setup lang="ts">
import { IconDisc, IconEdit, IconMoodPuzzled, IconMusicPlus } from "@tabler/icons-vue";
import { Container, Draggable } from 'vue-dndrop'
import AlbumItem from "@/components/AlbumItem.vue";
import { computed, onUnmounted, ref } from "vue";
import type { Album } from "@/types.ts";
import { applyDrag } from "@/utils.ts";
import { useStore } from "@/store.ts";
import { useRouter } from "vue-router";

const store = useStore()
const router = useRouter()

const isMobile = window.innerWidth <= 768
const triggerInput = ref<HTMLInputElement>()

const onQueueDrop = (dropResult: any) => {
  store.queue = applyDrag(store.queue, dropResult);
  store.save()
}

const onListenedDrop = (dropResult: any) => {
  store.listened = applyDrag(store.listened, dropResult);
  store.save()
}

const pickRandomAlbum = () => {
  window.open(store.queue[Math.floor(Math.random() * store.queue.length)].spotifyUrl)
} 

const goToAddPage = () => {
  triggerInput.value?.focus()  
  router.push({ name: 'add' })
}

const queue = computed(() => store.queue.filter((album: Album) => {
  const { title, artist, year } = album

  const matchesSearch = [title, artist].some(str => str.toLowerCase().includes(store.search.toLowerCase()))

  if (store.activeYear > '-1') {
    return String(year).charAt(2) === store.activeYear && matchesSearch
  }

  return matchesSearch
}))

const listened = computed(() => store.listened.filter((album: Album) => {
  const { title, artist, score, year } = album

  const matchesSearch = [title, artist].some(str => str.toLowerCase().includes(store.search.toLowerCase()))

  if (store.activeScore && store.activeYear > '-1') {
    const s = Number(score)
    return (store.activeScore === 4 ? s <= 4 : s == store.activeScore) && String(year).charAt(2) === store.activeYear && matchesSearch
  }
  
  if (store.activeScore) {
    const active = Number(store.activeScore)
    const s = Number(score)
    return (active === 4 ? s <= 4 : s == active) && matchesSearch
  }

  if (store.activeYear > '-1') {
    return String(year).charAt(2) === store.activeYear && matchesSearch
  }

  return matchesSearch
}))

onUnmounted(() => {
  store.showFilter = false
})
</script>

<template>
  <div v-if="!store.activeScore">
    <header :style="{ 'top': store.showFilter ? (isMobile ? '127px' : '83px') : '32px' }" class="group flex items-center gap-2 text-black pb-1.5 sticky !inset-x-0 bg-white z-[999] px-2 shadow-md">
      <h2 class="text-2xl font-semibold">Up Next</h2>
      &bullet;
      <div class="flex items-center text-lg font-medium gap-0.5 mt-0.5 -ml-0.5">
        <IconDisc size="20" class="spin" />
        <span>{{ queue.length }}</span>
      </div>

      <div class="ml-auto flex gap-1.5">
        <button v-if="!isMobile" class="hidden group-hover:grid text-[1.3rem] text-center sm:text-2xl font-bold text-white bg-indigo-500 shadow-md size-[30px] leading-3 z-40 place-content-center rounded opacity-85" @click="store.editSection = store.editSection ? undefined : 'queue'">
          <IconEdit />
        </button>
        <button class="bg-violet-500 text-white text-lg h-[30px] active:opacity-55 font-bold px-2 rounded shadow" @click="pickRandomAlbum">Surprise Me</button>
      </div>
    </header>
    <Container @drop="onQueueDrop" tag="ul" class="space-y-2.5 p-2.5 pt-3">
      <div v-if="!queue.length" class="text-black/40 h-16 w-full grid place-content-center">
        <div class="flex items-center gap-1 font-medium">
          <IconMoodPuzzled />
          Nothing Found
        </div>
      </div>
      <Draggable tag="li" v-for="album in queue" :key="album?.id" :drag-not-allowed="isMobile">
        <AlbumItem :album section="queue" @active-artist="artist => store.search = artist" />
      </Draggable>
    </Container>
  </div>

  
  <header :style="{ 'top': store.showFilter ? (isMobile ? '127px' : '83px') : '32px' }" class="group flex items-center gap-2 text-black pb-1.5 sticky top-8 sm:top-11 bg-white z-[999] px-2 shadow-md">
    <h2 class="text-2xl font-semibold">Listened</h2>
    &bullet;
    <div class="flex items-center text-lg font-medium gap-0.5 mt-0.5 -ml-0.5">
      <IconDisc size="20" class="spin" />
      <span>{{ listened.length }}</span>
    </div>
    <button v-if="!isMobile" class="hidden group-hover:grid ml-auto mr-0.5 text-[1.3rem] text-center sm:text-2xl font-bold text-white bg-indigo-500 shadow-md size-[30px] leading-3 z-40 place-content-center rounded opacity-85" @click="store.editSection = store.editSection ? undefined : 'listened'">
      <IconEdit />
    </button>
  </header>
  
  <Container @drop="onListenedDrop" tag="ul" class="space-y-2.5 p-2.5 pt-3">
    <div v-if="!listened.length" class="text-black/40 h-16 w-full grid place-content-center">
      <div class="flex items-center gap-1 font-medium">
        <IconMoodPuzzled />
        Nothing Found
      </div>
    </div>      
    <Draggable tag="li" v-for="album in listened" :key="album?.id" :drag-not-allowed="isMobile">
      <AlbumItem :album section="listened" @active-artist="artist => store.search = artist" />
    </Draggable>
  </Container>
    
    <button @click="goToAddPage" class="sm:hidden fixed bottom-4 right-4 z-50 size-16 rounded-full border border-white shadow bg-white/60 backdrop-blur text-green-400 grid place-content-center">
      <IconMusicPlus size="40" stroke-width="1.7" class="mr-0.5 mb-0.5" />
    </button>
    <input name="hidden" ref="triggerInput" style="position: absolute; opacity: 0; height: 0; pointer-events: none;" type="text" />
</template>
