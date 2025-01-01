<script setup lang="ts">
import { IconPhotoDown, IconPhotoEdit } from '@tabler/icons-vue'
import { reactive, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ListType, useStore } from "@/store";
import type { Album } from "@/types";
import SpotifyAlbumsAutocomplete from "@/components/SpotifyAlbumsAutocomplete.vue";

const store = useStore()

const emit = defineEmits(['close'])
const props = defineProps<{
  album?: Album,
  type?: ListType
}>()

let file: File | undefined
const coverPreview = ref(props.album?.cover)
const form = reactive<Album>({
  id: props.album?.id ?? Date.now(),
  cover: props.album?.cover ?? '',
  title: props.album?.title ?? '',
  artist: props.album?.artist ?? '',
  year: props.album?.year ?? '',
  score: props.album?.score ?? 0,
  spotifyUrl: props.album?.spotifyUrl ?? '',
})

const onFileChange = async (event: Event) => {
  file = (event.target as HTMLInputElement).files![0]
  coverPreview.value = URL.createObjectURL(file as Blob)
}

const removeCover = () => {
  file = undefined
  form.cover = ''
  coverPreview.value = ''
}

const submit = async () => {
  emit('close')
  if (file) {
    form.cover = await store.uploadCover(file)
  }
  if (props.album) {
    await store.put(props.type!, form)
  } else {
    await store.post(form)
  }
}

const fillForm = (album: Album) => {
  form.cover = album.cover
  form.title = album.title
  form.artist = album.artist
  form.year = album.year
  form.spotifyUrl = album.spotifyUrl
  coverPreview.value = album.cover
}
</script>

<template>
  <TransitionRoot appear show as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-amber-950/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform rounded-2xl bg-amber-50 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-amber-950">
                {{ album ? 'Edit Album' : 'New Album' }}
              </DialogTitle>
              <SpotifyAlbumsAutocomplete @get-album-data="fillForm" />

              <div class="mt-2 flex gap-2">
                <div class="relative">
                  <input id="cover" type="file" accept="image/*" class="hide-file-input text-transparent block size-24 rounded-md border-2 border-dashed border-amber-700/20" @change="onFileChange">
                  <img v-if="coverPreview" :src="coverPreview" alt="cover preview" class="absolute inset-0 -z-10 rounded-md">
                  <IconPhotoDown size="35" stroke-width="1.5" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 text-[#eddbc5]" />
                </div>
                <div class="space-y-2 h-full">
                  <input v-model="form.title" type="text" placeholder="Title" class="border-amber-700/20 border-2 w-full rounded px-2 bg-amber-50 placeholder-amber-950/50 focus:outline-none">
                  <input v-model="form.artist" type="text" placeholder="Artist" class="border-amber-700/20 border-2 w-full rounded px-2 bg-amber-50 placeholder-amber-950/50 mb-auto focus:outline-none">
                  <div class="flex items-centers h-7">
                    <button v-if="coverPreview" class="flex items-center gap-1 h-full text-amber-50 bg-blue-400 text-sm p-0.5 pr-1 rounded hover:opacity-70" @click="removeCover">
                      <IconPhotoEdit size="20" />
                      <span>Change Cover</span>
                    </button>
                    <input v-model="form.year" type="number" max="2050" placeholder="Year" class="border-amber-700/20 border-2 ml-auto w-[60px] focus:outline-none rounded pl-2.5 pr-2 bg-amber-50 placeholder-amber-950/50">
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <button type="button" class="ml-auto block justify-center rounded-md border border-transparent bg-green-200 px-3 py-1 text-sm font-medium text-green-900 hover:bg-green-300 focus:outline-none" @click="submit">
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>