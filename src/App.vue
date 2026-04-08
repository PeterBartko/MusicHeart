<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/layout/Navbar.vue'
import AlbumDialog from '@/components/AlbumDialog.vue'
import { useStore } from "@/store";
import Loader from '@/components/Loader.vue'
import { getAccessToken } from '@/spotify';

const store = useStore()

const isMobile = window.innerWidth <= 768
const loading = ref(false)
const albumDialogVisible = ref(false)

const shortcuts = (event: KeyboardEvent) => {
  if (isMobile) {
    return
  }

  if (event?.key === 'a' && store.search === '') {
    albumDialogVisible.value = true
  }
}

onMounted(async () => {
  loading.value = true
  await store.get()
  loading.value = false

  localStorage.setItem('token', await getAccessToken())
  window.addEventListener('keyup', shortcuts)
})
onUnmounted(() => window.removeEventListener('keyup', shortcuts))
</script>

<template>
  <div v-if="loading" class="fixed inset-0">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Loader />
    </div>
  </div>

  <main v-else :style="{ 'margin-top': store.showFilter ? (isMobile ? '118px' : '78px') : '32px' }">
    <Navbar />
    <router-view />
  </main>

  <transition name="fade">
    <AlbumDialog v-if="albumDialogVisible" @close="albumDialogVisible = false" />
  </transition>
</template>
