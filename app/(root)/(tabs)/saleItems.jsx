import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../Lib/supabase";
import { router } from "expo-router";
export default function RecordSale() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [salePrice, setSalePrice] = useState("");
  const [items, setItems] = useState([]);
const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdownHandler = () => setDropdownOpen((prev) => !prev);

const selectItemHandler = (item) => {
  setSelectedItem(item);
  setDropdownOpen(false);
};
  // FETCH 
     const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, purchase_price, sale_price, quantity, total_sold_items, sales_history,current_stock"
        );

      if (error) {
        console.log("Fetch error:", error);
      } else {
        setItems(data || []);
      }
    };
  useEffect(() => {
 

    fetchProducts();
  }, []);

  // CALCULATIONS (SAFE UI ONLY)
  const qty = Number(quantity) || 0;

  const unitPrice =
    Number(salePrice) || selectedItem?.sale_price || 0;

  const totalAmount = qty * unitPrice;

  const profit = selectedItem
    ? (unitPrice - selectedItem.purchase_price) * qty
    : 0;

  // CONFIRM SALE
  const AddSaleHandler = async () => {
    if (!selectedItem) {
      console.log("Select item first");
      return;
    }

    const product = selectedItem;
console.log(product);
    const qtyNum = Number(quantity);
    const unitPriceFinal =
      Number(salePrice) || product.sale_price;

    const totalAmountFinal = qtyNum * unitPriceFinal;

    const profitFinal =
      (unitPriceFinal - product.purchase_price) * qtyNum;

    // prevent negative stock
    if (qtyNum > product.quantity) {
      console.log("Not enough stock");
      return;
    }

    const newStock = product.current_stock - qtyNum;

    const newSale = {
      date: new Date().toISOString().split("T")[0],
      qty: qtyNum,
      sale_price: unitPriceFinal,
      total: totalAmountFinal,
      profit: profitFinal,
    };
console.log(newStock);

    const updatedHistory = [
      ...(product.sales_history || []),
      newSale,
    ];

    const { error } = await supabase
      .from("products")
      .update({
        total_sold_items:
          (product.total_sold_items || 0) + qtyNum,
        current_stock: newStock,
        sales_history: updatedHistory,
      })
      .eq("id", product.id);

    if (error) {
      console.log("Sale error:", error);
    } else {
      console.log("Sale saved successfully ✔");
 router.push({
      pathname: "/",
    })
      // reset inputs
      setQuantity("1");
      setSalePrice("");
      setSelectedItem(null);
        fetchProducts();
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#f9fafb" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Record Sale
      </Text>

      {/* SELECT ITEM */}
      <Text>Select Item</Text>

     <Text style={{ marginBottom: 6, color: "#555" }}>Select Item</Text>

<View style={{ position: "relative", zIndex: 10 }}>

  <Pressable
    onPress={toggleDropdownHandler}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: dropdownOpen ? "#10b981" : "#ddd",
      borderRadius: 8,
      backgroundColor: "white",
    }}
  >
    <Text style={{ color: selectedItem ? "#111" : "#aaa", fontSize: 15 }}>
      {selectedItem ? selectedItem.name : "Choose a product..."}
    </Text>
    <Text style={{ color: "#888", fontSize: 12 }}>
      {dropdownOpen ? "▲" : "▼"}
    </Text>
  </Pressable>

  {dropdownOpen && (
    <View
      style={{
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        elevation: 10,
        zIndex: 999,
      }}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => selectItemHandler(item)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            backgroundColor:
              selectedItem?.id === item.id ? "#f0fdf4" : "white",
            borderBottomWidth: index < items.length - 1 ? 1 : 0,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <Text style={{ fontSize: 14, color: "#111" }}>{item.name}</Text>
          <View
            style={{
              backgroundColor: item.current_stock < 5 ? "#fef2f2" : "#f0f0f0",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: item.current_stock < 5 ? "#dc2626" : "#666",
              }}
            >
              Stock: {item.current_stock}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  )}
</View>

      {/* QUANTITY */}
      <Text style={{ marginTop: 15 }}>Quantity Sold</Text>
      <TextInput
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />

      {/* PRICE */}
      <Text style={{ marginTop: 10 }}>
        Sale Price per Unit (Optional)
      </Text>
      <TextInput
        keyboardType="numeric"
        value={salePrice}
        onChangeText={setSalePrice}
        placeholder={`Default: ${selectedItem?.sale_price || ""}`}
        style={styles.input}
      />

      {/* SUMMARY */}
      <View style={styles.card}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Sale Summary
        </Text>

        <Row label="Item" value={selectedItem?.name || "-"} />
        <Row label="Quantity" value={`${qty} units`} />
        <Row label="Unit Price" value={`₨${unitPrice}`} />

        <View style={styles.line} />

        <Row
          label="Total Amount"
          value={`₨${totalAmount}`}
          bold
        />

        <Row
          label="Profit"
          value={`₨${profit}`}
          green
          bold
        />
      </View>

      {/* BUTTON */}
      <Pressable onPress={AddSaleHandler} style={styles.button}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          Confirm Sale
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ROW COMPONENT */
const Row = ({ label, value, bold, green }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 4,
    }}
  >
    <Text style={{ color: "#555" }}>{label}</Text>
    <Text
      style={{
        fontWeight: bold ? "bold" : "normal",
        color: green ? "green" : "#000",
      }}
    >
      {value}
    </Text>
  </View>
);

/* STYLES */
const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },

  dropdown: {
    marginTop: 5,
  },

  itemBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "white",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  line: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginVertical: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
  },
};