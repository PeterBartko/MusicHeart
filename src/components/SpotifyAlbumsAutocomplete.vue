<script setup lang="ts">
import { ref, watch } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { fetchAlbums } from '@/spotify';
import { IconBrandSpotify } from '@tabler/icons-vue'

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
        <div class="w-full flex border-zinc-700/20 border-2 rounded sp-1">
          <IconBrandSpotify class="text-green-500 mr-1" />
          <ComboboxInput placeholder="Search album on spotify" @input="fetchSpotifyAlbums($event.target.value)" class="bg-zinc-50 focus:outline-none placeholder-zinc-950/50" />
        </div>

        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ComboboxOptions class="absolute hide-scroll-bar mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-zinc-50 py-1 text-base shadow focus:outline-none sm:text-sm">
            <ComboboxOption
              v-for="album in albums"
              as="template"
              :key="album.id"
              :value="album"
              v-slot="{ selected, active }"
            >
              <li class="relative cursor-default select-none p-1" :class="{ 'bg-zinc-400 text-zinc-50': active, 'text-black': !active }">
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
