<script setup lang="ts">
import { IconPhotoX, IconPhotoDown } from '@tabler/icons-vue'
import { reactive, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useStore } from "@/store";
import Loader from "@/components/Loader.vue";
import { Album } from "@/types";

const store = useStore()

const emit = defineEmits(['close'])
const props = defineProps<{
  album?: Album,
  type?: string
}>()

let file: File
const loading = ref(false)
const coverPreview = ref()
const form = reactive({
  id: props.album?.id ?? Date.now(),
  cover: props.album?.cover ?? '',
  title: props.album?.title ?? '',
  artist: props.album?.artist ?? '',
  year: props.album?.year ?? '',
  score: props.album?.score ?? 0,
})

const onFileChange = async (event: InputEvent) => {
  file = event.target.files[0]
  coverPreview.value = URL.createObjectURL(file)
}

const removeCover = () => {
  file = undefined
  form.cover = ''
  coverPreview.value = ''
}

const submit = async () => {
  loading.value = true

  if (file) {
    form.cover = await store.uploadCover(file)
  }

  if (props.album) {
    await store.put(props.type, form)
  } else {
    await store.post(form)
  }

  loading.value = false
  emit('close')
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-amber-50 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-amber-950">
                {{ album ? 'Edit Album' : 'New Album' }}
              </DialogTitle>
              <div class="mt-2 flex gap-2">
                <div class="relative">
                  <input id="cover" type="file" accept="image/*" class="hide-file-input text-transparent block size-24 rounded-md border-2 border-dashed border-amber-700/20" @change="onFileChange">
                  <img v-if="coverPreview" :src="coverPreview" alt="cover preview" class="absolute inset-0 -z-10 rounded-md">
                  <IconPhotoDown size="35" stroke-width="1.5" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 text-[#eddbc5]" />
                </div>
                <div class="space-y-2 h-full">
                  <input v-model="form.title" type="text" placeholder="Title" class="border-amber-700/20 border-2 w-full rounded px-2 bg-amber-50 placeholder-amber-950/50">
                  <input v-model="form.artist" type="text" placeholder="Artist" class="border-amber-700/20 border-2 w-full rounded px-2 bg-amber-50 placeholder-amber-950/50 mb-auto">
                  <div class="flex items-centers h-7">
                    <button v-if="coverPreview" class="flex items-center gap-1 h-full text-amber-50 bg-red-400 text-sm p-0.5 pr-1 rounded hover:opacity-70" @click="removeCover">
                      <IconPhotoX size="20" />
                      <span>Remove Cover</span>
                    </button>
                    <input v-model="form.year" type="number" max="9999" placeholder="Year" class="border-amber-700/20 border-2 ml-auto w-[57px] rounded px-2 bg-amber-50 placeholder-amber-950/50">
                  </div>
                </div>
              </div>

              <div v-if="loading" class="bg-amber-50/80 fixed inset-0">
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader />
                </div>
              </div>

              <div class="mt-4">
                <button type="button" class="ml-auto block justify-center rounded-md border border-transparent bg-green-200 px-3 py-1 text-sm font-medium text-green-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="submit">
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