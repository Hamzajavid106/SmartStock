import { View, Text, FlatList, Image, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../../Lib/supabase";
import { router } from "expo-router";
export default function ProductPage() {
  const [products, setProducts] = useState([]);
const [search, setSearch] = useState("");
const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("Fetch error:", error);
    } else {
      setProducts(data);
    }
  };
useEffect(() => {
  fetchProducts();
}, []);

useEffect(() => {
  setFilteredProducts(products);
}, [products]);

const handleSearch = (text) => {
  setSearch(text);

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(text.toLowerCase())
  );

  setFilteredProducts(filtered);
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Single product UI
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}   onTouchEnd={() =>
    router.push({
      pathname: "/ItemDetail",
      params: item,
    })
  }>
    
        {/* IMAGE LEFT */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* DETAILS RIGHT */}
        <View style={{ flex: 1, marginLeft: 12 }}>

          {/* NAME */}
          <Text style={styles.name}>{item.name}</Text>

          {/* CATEGORY */}
          <Text style={styles.category}>{item.category}</Text>
          <View style={{
            flexDirection:"row",
            justifyContent:"space-between",
          }}>

          <View>
 <Text style={styles.qty}>Qty: {item.current_stock}
            <Text style={{color:"red" }}>/</Text>
            {item.quantity} </Text>
          </View>
          <View>
            <Text style={styles.qty}>Sold: {item.total_sold_items}
           </Text>
          </View>
          </View>
          {/* QUANTITY BIG */}
         

          {/* PRICES SMALL */}
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={styles.price}>
              Buy: ₨{item.purchase_price}
            </Text>

            <Text style={[styles.price, { marginLeft: 10 }]}>
              Sell: ₨{item.sale_price}
            </Text>
          </View>

          {/* LOCATION */}
          <Text style={styles.location}>
            Shelf: {item.shelf_location}
          </Text>

        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 10 }}>
     <View>
      <Text
  style={{
    fontSize: 26,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 5,
    letterSpacing: 0.5,
  }}
>
  Inventory
</Text>
<Text style={{
  marginLeft:4,
  color:"#6b7280",
  fontSize:12,
  marginTop:-6
}}>{products.length} Items in Stock</Text>
     </View>
   
<View>
  
<TextInput
  placeholder="🔍 Search product..."
  value={search}
  onChangeText={handleSearch}
  style={{
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  }}
/>
</View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
}

// 🎨 STYLES
const styles = {
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },

  category: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  qty: {
    fontSize: 18, // BIG SIZE
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },

  price: {
    fontSize: 12,
    color: "#444",
  },

  location: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
};