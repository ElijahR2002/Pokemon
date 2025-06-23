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
                      v-model="newCard.color"
                      label="Color"
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
                      v-model="newCard.Number"
                      label="Number"
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

        <v-row>
          <v-col
            v-for="card in cards"
            :key="card.id"
            cols="12"
            md="3"
          >
            <v-card class="mb-4 pa-3 bg-secondary" outlined elevation="2" rounded="xl">
              {{ card.cardName }} <br> {{ card.set }} <br> ${{ card.purchasedPrice }} <br> ${{ card.sellPrice }} <br> {{ card.condition }} <br> {{ card.Number }}<br>
              <v-btn color="primary" @click="markAsSold(card)" class="mr-2">Mark as Sold</v-btn>
              <v-btn color="error" @click="removeCard(card.id)">Delete</v-btn>
            </v-card>
          </v-col>
        </v-row>


          <h2>Total Profit: ${{ profit.toFixed(2) }}</h2>
      </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

const dialog = ref(false);

const cards = ref([]);
const newCard = ref({
  cardName: '',
  set: '',
  color: '',
  purchasedPrice: 0,
  sellPrice: 0,
  condition: '',
  sold: false,
  Number: ''
});

const fetchCards = async () => {
  cards.value = [];
  const querySnapshot = await getDocs(collection(db, "Cards"));
  querySnapshot.forEach(docSnap => {
    cards.value.push({ id: docSnap.id, ...docSnap.data() });
  });
  console.log(cards.value);
};

const addCard = async () => {
  await addDoc(collection(db, "Cards"), newCard.value);
  newCard.value = {
    cardName: '',
    set: '',
    color: '',
    purchasedPrice: 0,
    sellPrice: 0,
    condition: '',
    sold: false,
    Number: ''
  };
  fetchCards();
};

const removeCard = async (id) => {
  await deleteDoc(doc(db, "Cards", id));
  fetchCards();
};

const markAsSold = async (card) => {
  await updateDoc(doc(db, "Cards", card.id), {
    sold: true
  });
  fetchCards();
};

const profit = computed(() =>
  cards.value.reduce((total, card) => {
    if (card.sold) {
      return total + (card.sellPrice - card.purchasedPrice);
    } else {
      return total - card.purchasedPrice;
    }
  }, 0)
);

onMounted(fetchCards);
</script>
