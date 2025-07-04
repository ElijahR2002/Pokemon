<!-- CardManager.vue -->
<template>
  <v-container class="py-5" fluid justify="center">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h1>Card Collection</h1>
        <v-btn color="primary" @click="dialog = true" class="mb-4">Add New Card</v-btn>

        <v-dialog v-model="dialog" max-width="600">
          <v-card rounded="lg" class="pa-4">
            <v-card-title class="text-h6 pb-0">Add New Card</v-card-title>

            <v-card-text>
              <v-form @submit.prevent="addCard">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newCard.cardName"
                      label="Card Name"
                      variant="outlined"
                      density="compact"
                      required
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newCard.set"
                      label="Set"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newCard.cardOwner"
                      label="Card Owner"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="newCard.purchasedPrice"
                      label="Purchase Price"
                      type="number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="newCard.sellPrice"
                      label="Sell Price"
                      type="number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newCard.condition"
                      label="Condition"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newCard.cardNumber"
                      label="Card Number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="addCard">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog" max-width="600">
          <v-card rounded="lg" class="pa-4">
            <v-card-title class="text-h6 pb-0">Edit Card</v-card-title>

            <v-card-text>
              <v-form @submit.prevent="updateCard" v-if="selectedCard">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="selectedCard.cardName"
                      label="Card Name"
                      variant="outlined"
                      density="compact"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="selectedCard.set"
                      label="Set"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="selectedCard.cardOwner"
                      label="Card Owner"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="selectedCard.purchasedPrice"
                      label="Purchase Price"
                      type="number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="selectedCard.sellPrice"
                      label="Sell Price"
                      type="number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="selectedCard.condition"
                      label="Condition"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="selectedCard.cardNumber"
                      label="Card Number"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text @click="editDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="updateCard">Save Changes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row>
          <v-col v-for="card in cards" :key="card.id" cols="12" md="4">
            <v-card
              class="mb-4 pa-3 bg-secondary"
              outlined
              elevation="2"
              rounded="xl"
              font-weight-bold
            >
              Card: {{ card.cardName }} <br />
              Set: {{ card.set }} <br />
              Owned by: {{ card.cardOwner }} <br />
              Bought For: ${{ card.purchasedPrice }} <br />
              Selling For: ${{ card.sellPrice }} <br />
              Condition: {{ card.condition }} <br />
              Card Number: {{ card.cardNumber }}<br />
              <v-btn color="primary" @click="markAsSold(card)" class="mr-2">Mark as Sold</v-btn>
              <v-btn color="error" @click="removeCard(card.id)">Delete</v-btn>
              <v-btn
                color="edit"
                @click="editCard(card.id)"
                class="position-absolute top-0 right-0 ma-2"
                >Edit</v-btn
              >
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { useProfitStore } from '@/stores/profit'
import { useCollectionStore } from '../stores/collection'

const dialog = ref(false)
const editDialog = ref(false)
const collectionStore = useCollectionStore()
const collectionOwner = computed(() => collectionStore.collectionOwner)

const cardCollectionRef = computed(() =>
  collection(db, 'Collections', collectionOwner.value, 'Cards'),
)
const selectedCard = ref(null)
const cards = ref([])
const newCard = ref({
  cardName: '',
  set: '',
  cardOwner: '',
  purchasedPrice: 0,
  sellPrice: 0,
  condition: '',
  sold: false,
  cardNumber: '',
})

const fetchCards = async () => {
  if (!collectionOwner.value) return
  cards.value = []
  const querySnapshot = await getDocs(cardCollectionRef.value)
  const profitStore = useProfitStore()
  querySnapshot.forEach((docSnap) => {
    cards.value.push({ id: docSnap.id, ...docSnap.data() })
  })
  await profitStore.fetchProfit()
}
watch(collectionOwner, async (newOwner) => {
  if (newOwner) await fetchCards()
})

const addCard = async () => {
  await addDoc(cardCollectionRef.value, newCard.value)
  newCard.value = {
    cardName: '',
    set: '',
    cardOwner: '',
    purchasedPrice: 0,
    sellPrice: 0,
    condition: '',
    sold: false,
    cardNumber: '',
  }
  fetchCards()
}

const editCard = (id) => {
  const cardToEdit = cards.value.find((card) => card.id === id)
  if (cardToEdit) {
    selectedCard.value = { ...cardToEdit } // clone to avoid binding to original
    editDialog.value = true
  }
}

const updateCard = async () => {
  const id = selectedCard.value.id
  const { id: _, ...cardData } = selectedCard.value // exclude id from update
  await updateDoc(doc(db, 'Collections', collectionStore.collectionOwner, 'Cards', id), cardData)
  editDialog.value = false
  selectedCard.value = null
  fetchCards()
}

const removeCard = async (id) => {
  await deleteDoc(doc(db, 'Collections', collectionStore.collectionOwner, 'Cards', id))
  fetchCards()
}

const markAsSold = async (card) => {
  if (card.sold) return

  const cardRef = doc(db, 'Collections', collectionStore.collectionOwner, 'Cards', card.id)
  const soldRef = doc(db, 'Collections', collectionStore.collectionOwner, 'Sold_Cards', card.id)

  const updatedCard = { ...card, sold: true }

  await updateDoc(cardRef, { sold: true })

  await setDoc(soldRef, updatedCard)

  removeCard(card.id)
}

onMounted(fetchCards)
</script>
