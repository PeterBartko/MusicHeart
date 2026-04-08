<script setup lang="ts">
import { IconCheck, IconPhotoDown } from '@tabler/icons-vue'
import { ref } from 'vue'
import { useStore } from "@/store";
import type { Album } from "@/types";
import SpotifyAlbumsAutocomplete from "@/components/SpotifyAlbumsAutocomplete.vue";

const store = useStore()

const emit = defineEmits(['close'])

let file: File | undefined
const coverPreview = ref()
const titleInput = ref<HTMLInputElement>()
const album = ref<Album>()

const onFileChange = async (event: Event) => {
  file = (event.target as HTMLInputElement).files![0]
  coverPreview.value = URL.createObjectURL(file as Blob)
}

const submit = async () => {
  if (!album.value) return

  if (file) {
    album.value.cover = await store.uploadCover(file)
  }
  await store.post([album.value])

  emit('close')
}

const fillForm = (payload: Album) => {
  album.value = payload
  coverPreview.value = album.value.cover
  setTimeout(() => titleInput.value?.focus(), 100)
}
</script>

<template>
  <transition appear>
    <div class="fixed inset-0 z-[9999] bg-white/80 backdrop-blur grid place-items-center" @click.self="emit('close')">
      <form :class="[!album && 'mb-72', 'flex min-h-full items-center justify-center text-center']" @submit.prevent="submit">
        <div class="w-[400px] transform rounded-2xl p-6 text-left align-middle">
          <SpotifyAlbumsAutocomplete @get-album-data="fillForm" />

          <div v-if="album" class="mt-4 flex gap-2">
            <div class="relative">
              <input id="cover" type="file" accept="image/*" class="hide-file-input text-transparent block size-24 rounded-md border-2 border-dashed border-zinc-700/20" @change="onFileChange">
              <img v-if="coverPreview" :src="coverPreview" alt="cover preview" class="absolute inset-0 pointer-events-none rounded-md">
              <IconPhotoDown size="35" stroke-width="1.5" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 text-zinc-300" />
            </div>
            <div class="space-y-2 h-full">
              <input ref="titleInput" v-model="album.title" type="text" placeholder="Title" class="w-full focus:outline-none">
              <input v-model="album.artist" type="text" placeholder="Artist" class="w-full focus:outline-none">
              <input v-model="album.year" type="number" max="2050" placeholder="Year" class="w-[60px] focus:outline-none">
            </div>
          </div>

          <div class="mt-4">
            <button v-if="album" type="submit" class="flex items-center gap-0.5 ml-auto rounded-md bg-green-400 shadow px-2 py-1 font-medium text-white hover:bg-green-300 transition-colors" @click="submit">
              <IconCheck size="20" stroke-width="2.5" />
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  </transition>
</template>
