<script setup lang="ts">
import SpotifyAlbumsAutocomplete from '@/components/SpotifyAlbumsAutocomplete.vue';
import { useStore } from '@/store';
import type { Album } from '@/types';
import { IconCheck, IconTrash } from '@tabler/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()

const albums = ref<Album[]>([])

const submit = async() => {
  await store.post(albums.value)
  router.replace({ name: 'list' })
}
</script>

<template>
  <div class="p-2 min-h-[calc(100svh-88px)] h-full flex flex-col gap-2">
    <SpotifyAlbumsAutocomplete @get-album-data="album => albums.push(album)" />
    
    <div v-for="(album, i) in albums" :key="album.spotifyUrl" class="grid grid-cols-[80px_1fr_30px] gap-2 rounded py-1.5 bg-white md:hover:bg-zinc-100/50 cursor-grab active:cursor-grabbing transition-all">
      <a v-if="album.cover" :href="album.spotifyUrl" rel="noreferrer nooppener" class="size-20 shadow">
        <img v-if="album.cover" :src="album.cover" class="size-20 md:size-28 rounded-sm" alt="album cover">
      </a>
      <div class="flex flex-col justify-between">
        <div>
          <input v-model="album.title" class="text-lg font-bold w-full border-2 px-1 rounded">
          <h4 class="text-base font-medium">{{ album.artist }}</h4>
        </div>
        <h5>{{ album.year }}</h5>
      </div>
      <div class="flex flex-col justify-around">
        <button class="text-[1.3rem] text-center md:text-2xl font-bold text-white bg-rose-500 shadow-md h-[30px] leading-3 z-40 grid place-content-center rounded opacity-85" @click="albums.splice(i, 1)">
          <IconTrash />
        </button>
      </div>
    </div>

    <button v-if="albums.length" @click="submit" class="fixed bottom-4 right-4 z-50 size-16 rounded-full shadow bg-green-400 text-white grid place-content-center">
      <IconCheck size="40" stroke-width="2.5" />
    </button>
  </div>
</template>