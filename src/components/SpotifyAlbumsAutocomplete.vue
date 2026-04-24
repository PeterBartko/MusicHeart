<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { fetchAlbums, getAlbumById } from '@/spotify';
import { IconBrandSpotify } from '@tabler/icons-vue'
import type { SpotifyAlbum } from '@/types.ts';

const emit = defineEmits(['getAlbumData'])

const inputRef = ref()
const fetchById = ref(false)

onMounted(async () => {
  await nextTick()  
  setTimeout(() => {
    inputRef.value?.$el?.focus?.() || inputRef.value?.focus?.()
  }, 100)
})

const albums = ref<SpotifyAlbum[]>([])
const selected = ref()

const onSwitchIdChange = () => {
  fetchById.value = !fetchById.value
  setTimeout(() => {
    inputRef.value?.$el?.focus?.() || inputRef.value?.focus?.()
  }, 100)
}

const fetchSpotifyAlbums = async (query: string) => {
  if (fetchById.value) {
    albums.value = [await getAlbumById(query)]
  } else {
    albums.value = await fetchAlbums(query)
  }
}

const handleAlbumSelect = (album: SpotifyAlbum) => {
  emit('getAlbumData', {
    id: album.id,
    cover: album.images[1].url,
    title: album.name,
    artist: album.artists[0].name,
    year: album.release_date.slice(0, 4),
    spotifyUrl: album.external_urls.spotify,
  })
}
</script>

<template>
  <Combobox v-model="selected" @update:model-value="handleAlbumSelect">
    <div class="relative mt-1 w-full">
      <div class="w-full flex items-center gap-1 rounded-md pt-2">
        <IconBrandSpotify size="30" stroke-width="1.5" class="text-green-500" />
        <ComboboxInput autofocus inputmode="search" ref="inputRef" placeholder="Search albums on spotify..." @input="fetchSpotifyAlbums($event.target.value)" class="focus:outline-none bg-transparent placeholder-zinc-950/50 w-full" />
        <div :class="[fetchById ? 'bg-green-400' : 'bg-gray-300', 'text-white px-2 py-0.5 rounded shadow font-bold']" @click="onSwitchIdChange">ID</div>
      </div>

      <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <ComboboxOptions class="absolute hide-scroll-bar mt-1 z-50 max-h-[438px] w-full bg-white overflow-auto rounded-md py-1 text-base shadow focus:outline-none sm:text-sm">
          <ComboboxOption
            v-for="album in albums"
            as="template"
            :key="album.id"
            :value="album"
            v-slot="{ selected, active }"
          >
            <li class="relative cursor-default select-none p-1" :class="{ 'bg-green-400 text-zinc-50': active, 'text-black': !active }">
              <div class="flex items-center gap-2 truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                <img v-if="album.images.length" :src="album.images[2].url" class="size-10 rounded" alt="album cover">
                <span class="font-medium">
                  {{ album.name }}
                </span>
                &bullet;
                <span>
                  {{ album.artists[0].name }}
                </span>
              </div>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>
