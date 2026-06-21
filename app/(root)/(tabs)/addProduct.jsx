import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { supabase } from "../../../Lib/supabase";
export default function AddProduct() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shelf, setShelf] = useState("");
const [image, setImage] = useState(null);
const [imageUri, setImageUri] = useState(null);
  // calculations
  const purchase = Number(purchasePrice) || 0;
  const sale = Number(salePrice) || 0;
  const qty = Number(quantity) || 0;

  const totalInvestment = purchase * qty;
  const expectedRevenue = sale * qty;
  const expectedProfit = expectedRevenue - totalInvestment;

 
const pickAndUpload = async () => {
                console.log("its run");
                
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;

    const imageUrl = await uploadToSupabase(uri);

    console.log("Uploaded URL:", imageUrl);

    // 👉 now save in database
//      setImageUri(imageUrl);
  }
};
  const uploadToSupabase = async (imageUri) => {
  try {
    // unique file name
    const fileName = `product_${Date.now()}.jpg`;

    // convert uri → blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // upload to bucket
    const { data, error } = await supabase.storage
      .from("Items Imgs") // 👈 your bucket name
      .upload(fileName, blob, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.log("Upload error:", error);
      console.log("errinupload");
      
      return null;
    }

    // get public URL
    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

      setImageUri(publicUrlData.publicUrl)
      console.log(publicUrlData.publicUrl);
      
    return publicUrlData.publicUrl;
  } catch (err) {
    console.log(err);

    
  }
};

const handleAddItem = async () => {
console.log(imageUri,"dfds");

  const { data, error } = await supabase
    .from("products") 
    .insert([
      {
        name: String(name),
      category: String(category),
      purchase_price: Number(purchasePrice),
      sale_price: Number(salePrice),
      quantity: Number(quantity),
      shelf_location: String(shelf),
      image: String(imageUri),
      },
    ]);

  if (error) {
    console.log("DB error:", error);
  } else {
    console.log("Saved!", data);
  }
};

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#f9fafb" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
        Add New Item
      </Text>

      {/* ITEM NAME */}
      <Text>Item Name</Text>
      <TextInput
        placeholder="e.g., Rice Bag 10kg"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      {/* CATEGORY */}
      <Text>Category</Text>
      <TextInput
        placeholder=" Category"
        value={category}
        onChangeText={setCategory}
        style={inputStyle}
      />

      {/* PURCHASE PRICE */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text>Purchase Price (₨)</Text>
          <TextInput
            keyboardType="numeric"
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            style={inputStyle}
          />
        </View>

        {/* SALE PRICE */}
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text>Sale Price (₨)</Text>
          <TextInput
            keyboardType="numeric"
            value={salePrice}
            onChangeText={setSalePrice}
            style={inputStyle}
          />
        </View>
      </View>

      {/* QUANTITY */}
      <Text>Quantity</Text>
      <TextInput
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        style={inputStyle}
      />

      {/* SHELF */}
      <Text>Shelf Location</Text>
      <TextInput
        placeholder="e.g., A2"
        value={shelf}
        onChangeText={setShelf}
        style={inputStyle}
      />
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Pressable onPress={pickAndUpload}>
        <Text style={{ color: "blue", fontSize: 18 }}>
          Pick Image
        </Text>
      </Pressable>

    
    </View>
      {/* SUMMARY */}
      <View style={box}>
        <View style={{
                flexDirection:"row",
                justifyContent:"space-between"
        }}>
                <Text
          style={{
            color: "green",
          }}
        >
          Total Investment: 
        </Text>
        <Text style={{
            color: "green",
          }}>
                ₨{totalInvestment}
        </Text>
        </View>
        <View style={{
                flexDirection:"row",
                justifyContent:"space-between"
        }}>
                <Text
          style={{
            color: "green",
          }}
        >
           Expected Revenue: 
        </Text>
        <Text style={{
            color: "green",
          }}>
                 ₨{expectedRevenue}
        </Text>
        </View>
     <View style={{
                borderBottomWidth:1,
                borderColor:"#c4ebd2",
                marginVertical:6
     }}>
                
     </View>
     <View style={{
                flexDirection:"row",
                justifyContent:"space-between"
        }}>
                <Text
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          Expected Profit:
        </Text>
        <Text style={{
            color: "green",
          }}>
               ₨{expectedProfit}
        </Text>
        </View>
      
      </View>

      {/* BUTTON */}
      <Pressable onPress={handleAddItem} style={button}>
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Add Item to Inventory
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  backgroundColor: "white",
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
};

const box = {
  marginTop: 10,
  padding: 15,
  backgroundColor: "#f0fdf4",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#c4ebd2",
  color: "#c4ebd2",
};

const button = {
  marginTop: 20,
  backgroundColor: "green",
  padding: 15,
  borderRadius: 10,
};
