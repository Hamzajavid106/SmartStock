import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { supabase } from "../../../Lib/supabase";

export default function HomeScreen() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalStockValue: 0,
    todaySales: 0,
    todayProfit: 0,
  });
  const [todayHistory, setTodayHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const addItemHandler = () => router.push("/addProduct");
  const addSaleHandler = () => router.push("/saleItems");

  const loadDataHandler = async () => {
    setLoading(true);

    const { data: products } = await supabase
      .from("products")
      .select("name,current_stock, purchase_price, sales_history");

    const totalStockValue = (products || []).reduce(
      (sum, p) => sum + (p.current_stock || 0) * (p.purchase_price || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];

    const TodayHistory = (products || []).flatMap((p) => {
      const history = Array.isArray(p.sales_history) ? p.sales_history : [];
      return history.filter((entry) => entry.date === today);

    });
   
    
   const AllHistory = (products || [])
  .flatMap((p) => {
    const history = Array.isArray(p.sales_history) ? p.sales_history : [];

    return history.map((entry) => ({
      ...entry,
      product_name: p.name,
    }));
  })
  .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)) // 🔥 newest first
  ;

    const todaySales = TodayHistory.reduce((sum, e) => sum + (e.total || 0), 0);
    const todayProfit = TodayHistory.reduce((sum, e) => sum + (e.profit || 0), 0);

    setStats({ totalStockValue, todaySales, todayProfit });
    setTodayHistory(AllHistory);
    setLoading(false);
  };
useFocusEffect(
  useCallback(() => {
    loadDataHandler();   
  }, [])
);
  useEffect(() => {
    console.log(todayHistory,"yh");
    
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={styles.card}>
        <Text style={styles.label}>Total Stock Value</Text>
        <Text style={styles.value}>₨{stats.totalStockValue}</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.smallCard]}>
          <Text style={styles.label}>Today's Sales</Text>
          <Text style={styles.value}>₨{stats.todaySales}</Text>
        </View>

        <View style={[styles.card, styles.smallCard]}>
          <Text style={styles.label}>Today's Profit</Text>
          <Text style={[styles.value, { color: "green" }]}>
            ₨{stats.todayProfit}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={addItemHandler}>
          <Text style={styles.buttonText}>Add Item</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: "#2563eb" }]} onPress={addSaleHandler}>
          <Text style={styles.buttonText}>Add Saale</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}> Sales History</Text>

      {todayHistory.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
          No sales today
        </Text>
      ) : (
        todayHistory.map((item, index) => (
          <View key={index} style={styles.historyRow}>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.product_name}</Text>
              <Text style={{ fontWeight: "bold" }}>{item.date}</Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                Qty: {item.qty} × ₨{item.sale_price}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontWeight: "bold" }}>₨{item.total}</Text>
              <Text style={{ color: "green", fontSize: 12 }}>+₨{item.profit}</Text>
            </View>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
  },
  smallCard: {
    flex: 1,
  },
  label: {
    color: "#666",
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    elevation: 1,
  },
});