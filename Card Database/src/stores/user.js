import { defineStore } from 'pinia'
import { ref } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(true)

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    user.value = res.user
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  const fetchUser = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        loading.value = false
        resolve(currentUser)
      })
    })
  }

  return { user, loading, login, logout, fetchUser }
})
