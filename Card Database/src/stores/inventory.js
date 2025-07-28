import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useCollectionStore } from '../stores/collection'

export const useInventoryStore = defineStore('inventory', () => {
  const runningProfit = ref(0)
  const collectionStore = useCollectionStore()
  const collectionOwner = computed(() => collectionStore.collectionOwner)
  const fetchInventory = async () => {
    if (!collectionOwner.value) return
    let inventory = 0

    const cardsSnap = await getDocs(collection(db, 'Collections', collectionOwner.value, 'Cards'))
    cardsSnap.forEach((doc) => {
      inventory += Number(doc.data().sellPrice || 0)
    })

    runningProfit.value = inventory
  }

  return {
    runningProfit,
    fetchInventory,
  }
})
