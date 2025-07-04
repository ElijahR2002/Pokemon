<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <v-card class="pa-5" elevation="10" min-width="300">
          <h2 class="text-center mb-5">Login</h2>
          <v-text-field v-model="email" label="Email" type="email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn :loading="loading" color="primary" block @click="handleLogin"> Login </v-btn>
          <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await userStore.login(email.value, password.value)
    router.push('/') // redirect to homepage or dashboard
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
