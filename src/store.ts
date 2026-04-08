import { defineStore } from 'pinia';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from '@/firebase';
import { getCoverPath } from "@/utils";
import type { Album } from "@/types.ts";

export enum ListType {
  QUEUE = 'queue',
  LISTENED = 'listened'
}

export const useStore = defineStore('store', {
  state: () => ({
    queue: [] as Album[],
    listened: [] as Album[],
    activeYear: '-1',
    activeScore: 0,
    search: '',
    showFilter: window.innerWidth > 768,
  }),

  actions: {
    async save() {
      const docRef = doc(db, 'lists', 'albums')
      await setDoc(docRef, { queue: this.queue, listened: this.listened })
    },

    async uploadCover(file: File) {
      const snapshot = await uploadBytes(ref(storage, `covers/${file.name}`), file)
      return await getDownloadURL(snapshot.ref)
    },

    async post(payload: Album[]) {
      this.queue = this.queue.concat(payload)
      await this.save()
    },

    async get() {
      const docRef = doc(db, 'lists', 'albums')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { queue, listened } = docSnap.data()
        this.queue = queue ?? []
        this.listened = listened ?? []


        console.log(this.listened.map(a => `${a.artist} - ${a.title}: ${a.score}/10`));
        console.log(this.queue.map(a => `${a.artist} - ${a.title}`));
      }
    },

    async put(type: ListType, payload: Album) {
      this[type] = this[type].map(item => item.id === payload.id ? payload : item)
      await this.save()
    },

    async delete(type: ListType, id: number) {
      const index = this[type].findIndex(item => item.id === id)
      const [deleted] = this[type].splice(index, 1)
      await this.save()

      if (deleted.cover) {
        await deleteObject(ref(storage, getCoverPath(deleted)))
      }
    },

    async updateScore(albumId: number, score: string) {
      this.listened = this.listened.map(a => a.id === albumId ? { ...a, score } : a)
      await this.save()
    },

    async moveToListened(album: Album) {
      this.listened.unshift(album)
      await this.delete(ListType.QUEUE, album.id)
    },
  }
})
