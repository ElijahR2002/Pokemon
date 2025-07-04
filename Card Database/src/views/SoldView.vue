<template>
  <v-container class="py-5" fluid>
    <v-row justify="center">
      <v-col cols="12">
        <h1>Sold Cards</h1>

        <v-dialog v-model="unmarkDialog" max-width="600">
          <v-card rounded="lg" class="pa-4">
            <v-card-title class="text-p pb-0 text-wrap"
              >Are you sure you want to put {{ selectedCard.cardName }} back into
              inventory?</v-card-title
            >
            <v-card-actions>
              <v-spacer />
              <v-btn text variant="outlined" color="error" @click="unmarkDialog = false"
                >Cancel</v-btn
              >
              <v-btn variant="outlined" color="primary" @click="unmarkAsSold">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-text-field v-model="search" label="Search cards..." class="mb-4" />
        <v-data-table
          :headers="headers"
          :items="cards"
          :search="search"
          :items-per-page="10"
          class="elevation-1 bg-secondary text-white"
          full-width
          dense
          variant="outlined"
        >
          <template v-slot:top>
            <v-toolbar flat color="transparent" class="bg-primary">
              <v-toolbar-title>Sold Cards List</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              class="bg-edit"
              size="small"
              @click="openUnmarkDialog(item)"
              variant="outlined"
            >
              Unmark
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { useProfitStore } from '@/stores/profit'
import { useCollectionStore } from '../stores/collection'

// Stores
const profitStore = useProfitStore()
const collectionStore = useCollectionStore()

// Reactive collection owner
const collectionOwner = computed(() => collectionStore.collectionOwner)

// State
const cards = ref([])
const unmarkDialog = ref(false)
const selectedCard = ref(null)
const search = ref('')

// Headers
const headers = [
  { title: 'Unmark as Sold', value: 'actions', sortable: false },
  { title: 'Card Name', value: 'cardName' },
  { title: 'Set', value: 'set' },
  { title: 'Owner', value: 'cardOwner' },
  { title: 'Bought For ($)', value: 'purchasedPrice' },
  { title: 'Sold For ($)', value: 'sellPrice' },
  { title: 'Condition', value: 'condition' },
  { title: 'Card Number', value: 'cardNumber' },
]

// Fetch cards
const fetchCards = async () => {
  if (!collectionOwner.value) return

  const cardCollectionRef = collection(db, 'Collections', collectionOwner.value, 'Sold_Cards')
  const querySnapshot = await getDocs(cardCollectionRef)
  cards.value = querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))

  await profitStore.fetchProfit()
}

// Unmark logic
const openUnmarkDialog = (card) => {
  selectedCard.value = card
  unmarkDialog.value = true
}

const unmarkAsSold = async () => {
  const card = selectedCard.value
  if (!card || !collectionOwner.value) return

  unmarkDialog.value = false

  const cardRef = doc(db, 'Collections', collectionOwner.value, 'Cards', card.id)
  const soldRef = doc(db, 'Collections', collectionOwner.value, 'Sold_Cards', card.id)

  const updatedCard = { ...card, sold: false }

  await updateDoc(soldRef, { sold: false }) // mark sold = false in Sold_Cards
  await setDoc(cardRef, updatedCard) // move to active Cards
  await deleteDoc(soldRef) // delete from Sold_Cards

  fetchCards()
}

// Re-fetch when collectionOwner changes
watch(collectionOwner, () => {
  fetchCards()
})

onMounted(fetchCards)
</script>

<style scoped>
::v-deep(.v-data-table__th),
::v-deep(.v-data-table__td) {
  border: 1px solid #282838;
}
</style>
