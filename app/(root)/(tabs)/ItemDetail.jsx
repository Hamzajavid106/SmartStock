import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../../Lib/supabase";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.log("Error:", error);
      else setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);
useEffect(() => {
 console.log(product);
 
}, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Product Found</Text>
      </View>
    );
  }

  // ✅ Ab sales_history seedha array hai — koi parse nahi
  const salesHistory = product.sales_history || [];

  const purchase = Number(product.purchase_price) || 0;
  const sale = Number(product.sale_price) || 0;
  const qty = Number(product.quantity) || 0;
  const soldItems = Number(product.total_sold_items) || 0;
  const currentStock = Number(product.current_stock) || 0;
  const totalInvestment = purchase * qty;
  const revenue = sale * qty;
  const profit = revenue - totalInvestment;
const totalEarnedProfit = salesHistory.reduce((sum, entry) => {
                
                return sum + Number(entry.profit);
}, 0);
const totalEarnedRevenue = salesHistory.reduce((sum, entry) => {
                
                return sum + Number(entry.total);
}, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>

      {/* IMAGE */}
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 220 }}
      />

      <View style={{ padding: 15 }}>

        {/* NAME + CATEGORY */}
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          {product.name}
        </Text>
        <Text style={{ color: "#666", marginBottom: 10 }}>
          {product.category}
        </Text>

        {/* BASIC INFO */}
        <View style={styles.card}>
          <Text style={styles.title}>Basic Information</Text>
          <Row label="Purchase Price" value={`₨${purchase}`} />
          <Row label="Sale Price" value={`₨${sale}`} />
          <Row label="Purchased Stock" value={`${qty} units`} big />
          <Row label="Current Stock" value={`${currentStock} units`} big />
          <Row label="Sold Items" value={`${soldItems} units`} big />
          <Row label="Shelf Location" value={product.shelf_location} />
        </View>

        {/* FINANCIAL SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.title}>Financial Summary</Text>
          <Row label="Total Investment" value={`₨${totalInvestment}`} />
          <Row label="Potential Revenue" value={`₨${revenue}`} />
          <Row label="Earned Revenue" value={`₨${totalEarnedRevenue}`} />
          <Row label="Expected Profit" value={`₨${profit}`} bigGreen />
          <Row label="Earned Profit" value={`₨${totalEarnedProfit}`} bigGreen />
        </View>

        {/* SALES HISTORY */}
        <View style={styles.card}>
          <Text style={styles.title}>Sales History</Text>

          {salesHistory.length === 0 ? (
            <Text style={{ color: "#999", textAlign: "center", marginTop: 5 }}>
              NO Sale Record
            </Text>
          ) : (
            salesHistory.map((entry, index) => (
              <View key={index} style={styles.historyRow}>
                <View>
                  <Text style={{ fontWeight: "bold", color: "#333" }}>
                    {entry.date}
                  </Text>
                  <Text style={{ color: "#666", fontSize: 12 }}>
                    Qty: {entry.qty} × ₨{entry.sale_price}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontWeight: "bold" }}>₨{entry.total}</Text>
                  <Text style={{ color: "green", fontSize: 12 }}>
                    +₨{entry.profit}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </View>
    </ScrollView>
  );
}



const Row = ({ label, value, big, bigGreen }) => (
  <View style={styles.row}>
    <Text style={{ color: "#555" }}>{label}</Text>
    <Text
      style={{
        fontWeight: "bold",
        fontSize: big ? 18 : 14,
        color: bigGreen ? "green" : "#000",
      }}
    >
      {value}
    </Text>
  </View>
);

/* ---------- STYLES ---------- */

const styles = {
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
};