import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useCollectionStore } from '../stores/collection'

export const useProfitStore = defineStore('profit', () => {
  const runningProfit = ref(0)
  const collectionStore = useCollectionStore()
  const collectionOwner = computed(() => collectionStore.collectionOwner)
  const fetchProfit = async () => {
    if (!collectionOwner.value) return
    let profit = 0

    const cardsSnap = await getDocs(collection(db, 'Collections', collectionOwner.value, 'Cards'))
    cardsSnap.forEach((doc) => {
      profit -= Number(doc.data().purchasedPrice || 0)
    })

    const soldSnap = await getDocs(
      collection(db, 'Collections', collectionOwner.value, 'Sold_Cards'),
    )
    soldSnap.forEach((doc) => {
      profit += Number(doc.data().sellPrice || 0)
    })

    runningProfit.value = profit
  }

  return {
    runningProfit,
    fetchProfit,
  }
})
