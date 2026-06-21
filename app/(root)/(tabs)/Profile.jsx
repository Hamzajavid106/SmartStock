import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../../../Lib/supabase";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadUserHandler();
  }, []);

  const loadUserHandler = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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

  const logoutHandler = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/auth");
  };

  if (!user) return null;

  const firstLetter = profile?.full_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Green Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
        <Text style={styles.headerName}>
          {profile?.full_name || "No Name"}
        </Text>
        <Text style={styles.headerCompany}>
          {profile?.company || "No Company"}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.body}>
        <View style={styles.infoCard}>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoVal}>
                {profile?.full_name || "No Name"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🏢</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Company</Text>
              <Text style={styles.infoVal}>
                {profile?.company || "No Company"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoVal}>
                {user?.email || "No Email"}
              </Text>
            </View>
          </View>

        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logoutHandler}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#10b981",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 70,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10b981",
  },
  headerName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
  },
  headerCompany: {
    color: "#d1fae5",
    fontSize: 13,
    marginTop: 4,
  },
  body: {
    backgroundColor: "#f9fafb",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 16,
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 16,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: "green",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoutText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 15,
  },
});