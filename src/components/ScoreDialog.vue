<script setup lang="ts">
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { useStore } from "@/store";

const store = useStore()

const emit = defineEmits(['close'])
const props = defineProps<{
  id: number
  score: number
}>()

const form = ref(props.score ?? 0)

const submit = async () => {
  await store.updateScore(props.id, form.value)
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
              <div class="text-5xl text-center text-amber-950 mb-4">{{ form }}</div>
              <input v-model="form" type="range" min="0" max="10" step=".5" value="0">

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