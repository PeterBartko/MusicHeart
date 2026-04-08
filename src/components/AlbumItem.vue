<script setup lang="ts">
import { IconHeadphonesFilled, IconMusic, IconTrash } from "@tabler/icons-vue";
import { ListType, useStore } from "@/store.js";
import ScoreDialog from "@/components/ScoreDialog.vue";
import { computed, ref, watch } from "vue";
import type { Album } from "@/types.ts";
import { useSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const emit = defineEmits(['activeArtist'])
const props = defineProps<{
  album: Album,
  inQueue?: boolean,
}>()

const store = useStore()
const el = useTemplateRef('albm')
const elbtn = useTemplateRef('delbtn')
const { isSwiping, direction, lengthX } = useSwipe(el)

const isOpened = ref(false)
const scoreDialogVisible = ref(false)

const getColor = (score?: string) => {
  if (!score || score === '-') {
    return { background: '#ccc' }
  }

  const s = Number(score)
  return { background: s > 4 ? s >= 8 ? 'oklch(79.2% 0.209 151.711)' : 'oklch(82.8% 0.189 84.429)' : 'oklch(64.5% 0.246 16.439)' }
}

const deleteAlbum = () => {
  store.delete(props.inQueue ? ListType.QUEUE : ListType.LISTENED, props.album.id)
}

const swipeStyle = computed(() => {
  if (isSwiping.value && direction.value === 'left') {
    const x = lengthX.value > 120 ? 100 + (lengthX.value - 100) * 0.2 : lengthX.value
    return { 
      transform: `translateX(-${x}px)`,
      transition: 'none' 
    }
  }

  if (isOpened.value && !isSwiping.value) {
    return { 
      transform: 'translateX(-90px)', 
      transition: 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)' 
    }
  }

  return { 
    transform: 'translateX(0)', 
    transition: 'transform 0.3s ease' 
  }
})

watch(isSwiping, (swiping) => {
  if (swiping && (direction.value === 'left' || direction.value === 'right')) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  
  if (!swiping) {
    if (direction.value === 'left' && lengthX.value > 60) {
      elbtn.value?.classList.add('z-50')
      isOpened.value = true
    } else {
      isOpened.value = false
      elbtn.value?.classList.remove('z-50')
    }
  }
})
</script>

<template>
  <div class="relative">
    <div ref="delbtn" class="btn bg-rose-500 absolute right-0.5 inset-y-0.5 w-[80px] rounded-md -z-10 grid place-content-center" @click="deleteAlbum">
      <IconTrash class="text-white" size="26" stroke-width="2" />
    </div>
    
    <div ref="albm" :style="swipeStyle" class="grid grid-cols-[80px_1fr_30px] sm:grid-cols-[96px_1fr_30px] gap-2 rounded bg-white sm:hover:bg-zinc-100 cursor-grab active:cursor-grabbing transition-all">
      <a v-if="album.cover" :href="album.spotifyUrl" rel="noreferrer nooppener" class="size-20 sm:size-24 shadow">
        <img v-if="album.cover" :src="album.cover" class="size-20 sm:size-24 rounded-sm" alt="album cover">
      </a>
      <div v-else class="size-20 sm:size-24 grid place-items-center rounded-sm bg-gray-200">
        <IconMusic size="50" class="text-gray-300" />
      </div>
      <div class="flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold leading-[18px] line-clamp-2">{{ album.title }}</h3>
          <h4 class="text-base font-medium">{{ album.artist }}</h4>
        </div>
        <h5>{{ album.year }}</h5>
      </div>
      <div class="flex flex-col justify-around">
        <button v-if="inQueue" class="text-[1.3rem] text-center sm:text-2xl font-bold text-white bg-blue-500 shadow-md h-[30px] leading-3 z-40 grid place-content-center rounded opacity-85" @click="store.moveToListened(album)">
          <IconHeadphonesFilled />
        </button>
        <button v-else class="text-[1.3rem] text-center sm:text-2xl font-bold text-white h-[30px] shadow leading-3 grid place-content-center rounded opacity-85s" :style="getColor(album.score)" @click="scoreDialogVisible = true">
          {{ album.score ?? '-' }}
        </button>
      </div>
    </div>
  </div>

  <ScoreDialog v-if="scoreDialogVisible" @close="scoreDialogVisible = false" :album />
</template>

<style>
.swipe-left {
  transform: translateX(-100px);
  z-index: 999999 !important;
}
</style>