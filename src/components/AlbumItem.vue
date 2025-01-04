<script setup lang="ts">
import { IconEdit, IconHeadphonesFilled, IconMusic } from "@tabler/icons-vue";
import { ListType, useStore } from "@/store.js";
import ScoreDialog from "@/components/ScoreDialog.vue";
import AlbumDialog from "@/components/AlbumDialog.vue";
import DeletePopover from "@/components/DeletePopover.vue";
import { ref } from "vue";
import type { Album } from "@/types.ts";

const emit = defineEmits(['activeArtist'])
defineProps<{
  album: Album,
  inQueue?: boolean,
}>()

const store = useStore()

const albumDialogVisible = ref(false)
const scoreDialogVisible = ref(false)
const type = ref<ListType>()

const openModal = (listType: ListType) => {
  albumDialogVisible.value = true
  type.value = listType
}
</script>

<template>
  <div v-if="inQueue" class="flex items-center justify-between rounded p-1.5 pr-0.5 md:hover:bg-amber-100/50 cursor-grab active:cursor-grabbing">
    <div class="text-amber-950 flex">
      <a v-if="album.cover" :href="album.spotifyUrl" rel="noreferrer nooppener" class="size-20 md:size-28 mr-3 rounded-sm">
        <img :src="album.cover" alt="album cover from spotify">
      </a>
      <div v-else class="size-20 md:size-28 mr-3 grid place-items-center rounded-sm bg-gray-200">
        <IconMusic size="50" class="text-gray-300" />
      </div>
      <div class="flex flex-col justify-between">
        <h3 class="text-lg max-w-[235px] truncate md:max-w-full md:text-2xl font-bold">{{ album.title }}</h3>
        <p class="font-medium md:text-lg -mt-4 md:-mt-8 hover:underline cursor-pointer" @click="emit('activeArtist', album.artist)">{{ album.artist }}</p>
        <div class="">{{ album.year }}</div>
      </div>
    </div>

    <div class="flex flex-col md:h-28">
      <div class="flex flex-col gap-2 items-center mt-auto">
        <button class="ml-auto bg-green-400 text-amber-50 p-1 rounded-full hover:opacity-60" @click="store.moveToListened(album)">
          <IconHeadphonesFilled />
        </button>

        <div class="flex gap-2 md:flex-col">
          <button class="size-[32px] bg-blue-400 text-amber-50 p-1 rounded-full hover:opacity-60" @click="openModal(ListType.QUEUE)">
            <IconEdit />
          </button>
          <DeletePopover :type="ListType.QUEUE" :id="album.id" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-between rounded p-1.5 pr-0.5 md:hover:bg-amber-100/50 cursor-grab active:cursor-grabbing">
    <div :class="[/*album.score === '10'*/ false ? 'ten-out-of-ten' : 'text-amber-950', 'flex']">
      <a v-if="album.cover" :href="album.spotifyUrl" rel="noreferrer nooppener">
        <img v-if="album.cover" :src="album.cover" class="size-20 md:size-28 mr-3 rounded-sm" alt="album cover">
      </a>
      <div v-else class="size-20 md:size-28 mr-3 grid place-items-center rounded-sm bg-gray-200">
        <IconMusic size="50" class="text-gray-300" />
      </div>
      <div class="flex flex-col justify-between">
        <h3 class="text-lg max-w-[260px] truncate md:max-w-full md:text-2xl font-bold">{{ album.title }}</h3>
        <p :class="[album.score === '10' ? 'decoration-amber-300' : '', 'font-medium md:text-lg -mt-2 hover:underline cursor-pointer']" @click="emit('activeArtist', album.artist)">{{ album.artist }}</p>
        <div class="s-mt-2 mt-5">{{ album.year }}</div>
<!--        <button class="-mt-1 text-[1.3rem] font-bold w-fit" @click="scoreDialogVisible = true">{{ album.score }}</button>-->
      </div>
    </div>

    <div class="flex flex-col md:h-28">
      <div class="flex flex-col gap-2 items-center mt-auto">
        <button class="bg-blue-400 text-amber-50 p-1 rounded-full hover:opacity-60" @click="openModal(ListType.LISTENED)">
          <IconEdit />
        </button>
        <DeletePopover :type="ListType.LISTENED" :id="album.id" />
      </div>
    </div>
  </div>

  <AlbumDialog v-if="albumDialogVisible" @close="albumDialogVisible = false" :album :type />
  <ScoreDialog v-if="scoreDialogVisible" @close="scoreDialogVisible = false" :score="album.score" :id="album.id" />
</template>
