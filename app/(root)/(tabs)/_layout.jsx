import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform } from "react-native";

function TabBar({ state, descriptors, navigation }) {
  return (
    <BlurView
      intensity={80}
      style={{
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 65,
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor:
          Platform.OS === "android" ? "#fff" : "green",
      }}
    >
{state.routes
        .filter((route) =>    route.name !== "addProduct" &&
    route.name !== "ItemDetail" &&
    route.name !== "saleItems") 
        .map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        let icon = "home";
        if (route.name === "products") icon = "bag";
        if (route.name === "Profile") icon = "person";

        return (
          <Pressable
            key={route.name}
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={icon}
              size={24}
              color={isFocused ? "#000" : "#888"}
            />
            <Text style={{ fontSize: 10, color: isFocused ? "#000" : "#888" }}>
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen
        name="addProduct"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}