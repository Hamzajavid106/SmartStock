import { Stack } from "expo-router";
import { View, Text, Platform } from "react-native";
import { supabase } from "../Lib/supabase";
import { useEffect, useState } from "react";
import "../global.css";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSegments } from "expo-router";
<div className=""></div>
export default function RootLayout() {
  const [loaded] = useFonts({
    ...Ionicons.font,
  });

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const segments = useSegments(); 
  const isAuthScreen = segments[0] === "(auth)"; 


const today = new Date();

const formattedDate = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
    };

    loadUser();
  }, []);

  if (!loaded) return null;

  return (
    <>
      {/* ✅ HEADER (ONLY WHEN NOT AUTH) */}
      {!isAuthScreen && (
        <SafeAreaView>
          <View
            style={{
              height: 60,
              backgroundColor: "green",
              justifyContent: "center",
              paddingHorizontal: 15,
              marginBottom: Platform.OS === "web" ? -3 : -35,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              {profile?.company || "No Company"}
            </Text>
            <Text>
              {formattedDate}
            </Text>
          </View>
        </SafeAreaView>
      )}

      {/* NAVIGATION */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}