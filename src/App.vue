<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AlbumDialog from '@/components/AlbumDialog.vue'
import AlbumItem from '@/components/AlbumItem.vue'
import { IconPlus, IconDisc } from '@tabler/icons-vue'
import { Container, Draggable } from 'vue-dndrop'
import { useStore } from "@/store";
import { applyDrag } from "@/utils";
import Loader from '@/components/Loader.vue'
import type { Album } from "@/types.ts";

const store = useStore()

const isMobile = window.innerWidth <= 768
const loading = ref(false)
const albumDialogVisible = ref(false)
const search = ref('')
const activeFilter = ref<string | number>(-1)
const activeGold = ref(false)

onMounted(async () => {
  loading.value = true
  await store.get()
  loading.value = false
})

const onQueueDrop = (dropResult: any) => {
  store.queue = applyDrag(store.queue, dropResult);
  store.save()
}

const onListenedDrop = (dropResult: any) => {
  store.listened = applyDrag(store.listened, dropResult);
  store.save()
}

const queue = computed(() => store.queue.filter((album: Album) => {
  const { title, artist, year } = album

  const matchesSearch = [title, artist].some(str => str.toLowerCase().includes(search.value.toLowerCase()))

  if (activeFilter.value > -1) {
    return String(year).charAt(2) === activeFilter.value && matchesSearch
  }

  return matchesSearch
}))

const listened = computed(() => store.listened.filter((album: Album) => {
  const { title, artist, score, year } = album

  const matchesSearch = [title, artist].some(str => str.toLowerCase().includes(search.value.toLowerCase()))

  if (activeGold.value && activeFilter.value > -1) {
    return score === '10' && String(year).charAt(2) === activeFilter.value && matchesSearch
  }

  if (activeGold.value) {
    return score === '10' && matchesSearch
  }

  if (activeFilter.value > -1) {
    return String(year).charAt(2) === activeFilter.value && matchesSearch
  }

  return matchesSearch
}))
</script>

<template>
  <main class="hide-scroll-bar">
    <Navbar v-model="search" @active-year="filter => activeFilter = filter" @active-gold="filter => activeGold = filter" />

    <div v-if="loading" class="bg-amber-50/80 fixed inset-0">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader />
      </div>
    </div>

    <section v-else class="p-2 md:p-6">
      <header class="flex items-center gap-2 mb-3 text-amber-950">
        <h2 class="text-2xl font-semibold">Queue</h2>
        &bullet;
        <div class="flex items-center gap-0.5 mt-0.5">
          <IconDisc size="20" />
          <span>{{ queue.length }}</span>
        </div>
        <button class="flex items-center gap-0.5 pr-1 border-2 border-amber-950 rounded hover:text-green-400 hover:border-green-400 transition-colors" @click="albumDialogVisible = true">
          <IconPlus size="20" stroke-width="2.5" />
          New Album
        </button>
      </header>
      <Container @drop="onQueueDrop" tag="ul">
        <div v-if="!queue.length" class="text-amber-950/70 absolute left-1/2 -translate-x-1/2 top-4">No Albums in Queue</div>
        <Draggable tag="li" v-for="album in queue" :key="album?.id" :drag-not-allowed="isMobile">
          <AlbumItem :album in-queue @active-artist="artist => search = artist" />
        </Draggable>
      </Container>

      <hr class="my-12 border-amber-700/20">

      <header class="flex items-center gap-2 mb-3 text-amber-950">
        <h2 class="text-2xl font-semibold">Listened</h2>
        &bullet;
        <div class="flex items-center gap-0.5 mt-0.5">
          <IconDisc size="20" />
          <span>{{ listened.length }}</span>
        </div>
      </header>

      <Container @drop="onListenedDrop" tag="ul" class="space-y-s2">
        <div v-if="!listened.length" class="text-amber-950/70 absolute left-1/2 -translate-x-1/2 top-4">No Albums in Listened</div>
        <Draggable tag="li" v-for="album in listened" :key="album?.id" :drag-not-allowed="isMobile">
          <AlbumItem :album @active-artist="artist => search = artist" />
        </Draggable>
      </Container>
    </section>

    <AlbumDialog v-if="albumDialogVisible" @close="albumDialogVisible = false" />
  </main>
</template>
