import { supabase } from '../supabaseClient'

export const signUp = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    console.error('Error signing up:', error.message)
  }
  return user
}

export const signIn = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    console.error('Error signing in:', error.message)
  }
  return user
}
