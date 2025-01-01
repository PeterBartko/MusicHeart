<script setup lang="ts">
import { ref, watch } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { fetchAlbums } from '@/spotify';

const emit = defineEmits(['getAlbumData'])

const albums = ref([])
const selected = ref()
const fetchSpotifyAlbums = async (query: string) => {
  albums.value = await fetchAlbums(query)
  console.log(albums.value)
}

watch(selected, (value) => {
  emit('getAlbumData', {
    cover: value.images[1].url,
    title: value.name,
    artist: value.artists[0].name,
    year: value.release_date.slice(0, 4),
    spotifyUrl: value.external_urls.spotify,
  })
})
</script>

<template>
    <Combobox v-model="selected">
      <div class="relative mt-1 w-full">
        <ComboboxInput placeholder="Search album on spotify" @input="fetchSpotifyAlbums($event.target.value)" class="w-full border-amber-700/20 border-2 rounded px-2 bg-amber-50 placeholder-amber-950/50 focus:outline-none" />

        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ComboboxOptions class="absolute hide-scroll-bar mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-amber-50 py-1 text-base shadow focus:outline-none sm:text-sm">
            <ComboboxOption
              v-for="album in albums"
              as="template"
              :key="album.id"
              :value="album"
              v-slot="{ selected, active }"
            >
              <li class="relative cursor-default select-none p-1" :class="{ 'bg-amber-400 text-amber-50': active, 'text-amber-950': !active }">
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
