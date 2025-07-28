// stores/collection.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export const useCollectionStore = defineStore('collection', () => {
  const collectionOwner = ref('')
  const collectionOwners = ref([])

  const fetchCollectionOwners = async () => {
    const snapshot = await getDocs(collection(db, 'Collections'))
    collectionOwners.value = snapshot.docs.map((doc) => doc.id)

    if (!collectionOwner.value && collectionOwners.value.length > 0) {
      collectionOwner.value = collectionOwners.value[0]
    }
  }

  return {
    collectionOwner,
    collectionOwners,
    fetchCollectionOwners,
  }
})
