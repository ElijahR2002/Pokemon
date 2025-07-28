<script setup>
import { onMounted } from 'vue'
import { useProfitStore } from './stores/profit'
import { useCollectionStore } from './stores/collection'
import { useUserStore } from './stores/user'
import { useInventoryStore } from './stores/inventory'
import router from './router'

const profitStore = useProfitStore()
const collectionStore = useCollectionStore()
const userStore = useUserStore()
const inventoryStore = useInventoryStore()
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    await profitStore.fetchProfit()
    await collectionStore.fetchCollectionOwners()
    await inventoryStore.fetchInventory()
  }
})
</script>

<template>
  <v-app>
    <div v-if="!userStore.loading">
      <!-- Top Navigation Bar -->
      <v-app-bar v-if="userStore.user" app color="primary" dark>
        <v-app-bar-title
          >Profit: ${{ profitStore.runningProfit }} || Total Inventory: ${{
            inventoryStore.runningProfit
          }}</v-app-bar-title
        >

        <v-spacer />
        <RouterLink to="/" class="text-white mx-3">Inventory</RouterLink>
        <RouterLink to="/sold" class="text-white mx-3">Sold Cards</RouterLink>

        <v-select
          class="mx-3"
          label="Collection"
          :items="collectionStore.collectionOwners"
          v-model="collectionStore.collectionOwner"
          dense
          variant="outlined"
          hide-details
          style="max-width: 200px"
        />

        <v-btn
          v-if="userStore.user"
          variant="outlined"
          color="white"
          class="ml-4"
          @click="handleLogout"
        >
          Logout
        </v-btn>
      </v-app-bar>

      <!-- Page Content -->
      <v-main>
        <RouterView />
      </v-main>
    </div>
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
