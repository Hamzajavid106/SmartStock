import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl = "https://qformakysackhznxjhyy.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb3JtYWt5c2Fja2h6bnhqaHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjEzMDUsImV4cCI6MjA5NTg5NzMwNX0.VyqEaqqZmepMmIBvX2_C9geR1dcNn9lDpccEIZsc9vU";
const storage =
  Platform.OS === "web"
    ? typeof window !== "undefined"
      ? localStorage
      : undefined
    : AsyncStorage;


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});