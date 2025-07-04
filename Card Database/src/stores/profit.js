import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

export const useProfitStore = defineStore('profit', () => {
  const runningProfit = ref(0)
  const owner = 'Elijah_Mason'

  const fetchProfit = async () => {
    let profit = 0

    const cardsSnap = await getDocs(collection(db, 'Collections', owner, 'Cards'))
    cardsSnap.forEach((doc) => {
      profit -= Number(doc.data().purchasedPrice || 0)
    })

    const soldSnap = await getDocs(collection(db, 'Collections', owner, 'Sold_Cards'))
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
