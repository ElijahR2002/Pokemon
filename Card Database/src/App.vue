<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

// Reactive profit variable
const runningProfit = ref(0)
const collectionOwner = 'Elijah_Mason'

const fetchProfit = async () => {
  let profit = 0

  const cardsSnap = await getDocs(collection(db, 'Collections', collectionOwner, 'Cards'))
  cardsSnap.forEach((doc) => {
    const data = doc.data()
    profit -= Number(data.purchasedPrice || 0)
  })

  const soldSnap = await getDocs(collection(db, 'Collections', collectionOwner, 'Sold_Cards'))
  soldSnap.forEach((doc) => {
    const data = doc.data()
    profit += Number(data.sellPrice || 0)
  })

  runningProfit.value = profit
}

onMounted(fetchProfit)
</script>

<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Profit: ${{ runningProfit }}</v-app-bar-title>

      <v-spacer />
      <RouterLink to="/" class="text-white mx-3">Inventory</RouterLink>
      <RouterLink to="/sold" class="text-white mx-3">Sold Cards</RouterLink>
    </v-app-bar>

    <!-- Page Content -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
