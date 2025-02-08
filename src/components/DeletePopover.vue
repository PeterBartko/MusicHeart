<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { IconTrash } from "@tabler/icons-vue";
import { useStore } from "@/store";

const props = defineProps<{
  type: string
  id: number
}>()

const store = useStore()

const deleteAlbum = (close: Function) => {
  store.delete(props.type, props.id)
  close()
}
</script>

<template>
  <Popover v-slot="{ close }" class="relative">
    <PopoverButton class="bg-rose-400 text-zinc-50 p-1 rounded-full hover:opacity-60">
      <IconTrash />
    </PopoverButton>

    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute top-9 right-0 s-translate-x-1/2 px-4 sm:px-0 lg:max-w-3xl">
        <div class="rounded-lg bg-zinc-50 shadow-lg ring-1 ring-black/5 py-2 px-3">
          <p class="mb-2 text-black">Are you sure?</p>
          <div class="flex items-center gap-2">
            <button class="border-2 border-zinc-950 text-black w-20 rounded hover:opacity-60" @click="close()">Cancel</button>
            <button class="bg-rose-400 text-zinc-50 py-0.5 w-20 rounded hover:opacity-60" @click="deleteAlbum(close)">Yes</button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
