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
    queue: [],
    listened: []
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
    
    async post(payload: Album) {
      this.queue.unshift(payload)
      await this.save()
    },
    
    async get() {
      const docRef = doc(db, 'lists', 'albums')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const { queue, listened } = docSnap.data()
        this.queue = queue ?? []
        this.listened = listened ?? []
      }
    },
    
    async put(type: ListType, payload: Album) {
      this[type] = this[type].map(item => item.id === payload.id ? payload : item)
      await this.save()
    },
    
    async delete(type: ListType, id: number) {
      const index = this[type].findIndex(item => item.id === id)
      const [deleted] = this[type].splice(index, 1)
      
      if (deleted.cover) {
        await deleteObject(ref(storage, getCoverPath(deleted)))
      }
      await this.save()
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
