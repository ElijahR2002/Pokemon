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
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'

// Card data
const cards = ref([])
const unmarkDialog = ref(false)
const selectedCard = ref(null)

// Define table headers
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

// Firestore query
const collectionOwner = 'Elijah_Mason'
const search = ref('')
const cardCollectionRef = collection(db, 'Collections', collectionOwner, 'Sold_Cards')

const fetchCards = async () => {
  cards.value = []
  const querySnapshot = await getDocs(cardCollectionRef)
  querySnapshot.forEach((docSnap) => {
    cards.value.push({ id: docSnap.id, ...docSnap.data() })
  })
}

const openUnmarkDialog = (card) => {
  selectedCard.value = card
  unmarkDialog.value = true
}

const unmarkAsSold = async () => {
  unmarkDialog.value = false
  const card = selectedCard.value
  if (!card || !card.sold) return

  const cardRef = doc(db, 'Collections', collectionOwner, 'Cards', card.id)
  const soldRef = doc(db, 'Collections', collectionOwner, 'Sold_Cards', card.id)

  const updatedCard = { ...card, sold: false }
  await updateDoc(soldRef, { sold: false })

  await setDoc(cardRef, updatedCard)

  removeCard(card.id)
}

const removeCard = async (id) => {
  await deleteDoc(doc(db, 'Collections', collectionOwner, 'Sold_Cards', id))
  fetchCards()
}
onMounted(fetchCards)
</script>
<style scoped>
::v-deep(.v-data-table__th),
::v-deep(.v-data-table__td) {
  border: 1px solid #282838;
}
</style>
