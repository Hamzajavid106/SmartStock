import { View, Text, SafeAreaView,StyleSheet, TouchableOpacity,Animated  ,TextInput } from 'react-native'
import React, { useEffect, useState,useRef } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../Lib/supabase";
import { router } from 'expo-router';
export default function auth() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const loginAnim = useRef(new Animated.Value(0)).current;
  const signUpAnim = useRef(new Animated.Value(0)).current;
  const appName = process.env.EXPO_PUBLIC_APP_NAME;
  const [islogin,setIsLogin]=useState(true)
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [company, setCompany] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const[iserr,setiserr]=useState(false)
const LayoutHandler = () => setIsLogin(prev => !prev);
useEffect(() => {
  Animated.timing(animatedValue, {
    toValue: islogin ? 0 : 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
}, [islogin]);
const translateY = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 490], 
});

useEffect(() => {
  Animated.timing(loginAnim, {
    toValue: islogin ? -200 : 300, 
    duration: 400,
    useNativeDriver: true,
  }).start();
}, [islogin]);
useEffect(() => {
  Animated.timing(signUpAnim, {
    toValue: islogin ? -500 : -50, 
    duration: 400,
    useNativeDriver: true,
  }).start();
}, [islogin]);
const opacity = loginAnim.interpolate({
  inputRange: [0, 500],
  outputRange: [1, 0]
});



const handleSignup = async () => {
  try {

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Auth Error:", error.message);
      setiserr(true)
      return;
    }

    const user = data.user;

    if (!user) {
      console.log("No user returned");
      return;
    }

   
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          full_name: firstName + " " + lastName,
          company: company,
          email: email,
        },
      ]);

    if (profileError) {
      console.log("Profile Error:", profileError.message);
      return;
    }

    console.log("Signup successful ✔");
    router.replace("/(root)/(tabs)");
  } catch (err) {
    console.log("Unexpected Error:", err);
  }


};
  const handleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Login Error:", error.message);
      setiserr(true);
      return;
    }

    console.log("Login successful ✔");

    // redirect to app
    router.replace("/(root)/(tabs)");

  } catch (err) {
    console.log("Unexpected Error:", err);
  }
};
  return (
    <SafeAreaView >


     <View style={style.AuthScreen}>
      <View style={style.Container}>
         <Animated.View
  style={{
    transform: [{ translateY: signUpAnim }],
    
  }}
>
  <View style={style.signupContainer}>
    <Text style={style.signupTitle}>Create Account</Text>

    {/* First + Last Name (same row) */}
    <View style={style.row}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={[style.input, { flex: 1, marginRight: 5 }]}
        placeholderTextColor="#999"
      />
      <TextInput
      value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        style={[style.input, { flex: 1, marginLeft: 5 }]}
        placeholderTextColor="#999"
      />
    </View>

    {/* Company */}
    <TextInput
      placeholder="Company Name"
       value={company}
        onChangeText={setCompany}
      style={style.input}
      placeholderTextColor="#999"
    />

    {/* Email */}
    <TextInput
      placeholder="Email"
       value={email}
        onChangeText={setEmail}
      style={style.input}
      placeholderTextColor="#999"
    />

    {/* Password */}
    <View style={style.passwordContainer}>
      <TextInput
       value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={style.passwordInput}
        secureTextEntry={!passwordVisible}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
        <Ionicons
          name={passwordVisible ? "eye-off" : "eye"}
          size={22}
          color="#555"
        />
      </TouchableOpacity>
    </View>

    {/* Signup Button */}
    <TouchableOpacity style={style.signupButton} onPress={handleSignup}>
      <Text style={style.signupButtonText} >Sign Up</Text>
    </TouchableOpacity>
  </View>

</Animated.View>
        <Animated.View
  style={[
    style.SignUpAuthSlider,
    {
      transform: [{ translateY }],
       borderTopLeftRadius: islogin ? 2 : 90,
      borderTopRightRadius: islogin ? 2 : 90,
      borderBottomLeftRadius: islogin ? 90 : 2,
    borderBottomRightRadius: islogin ? 90 : 2,
    },
  ]}
>
   {islogin ? (

    <View style={style.greedBox}>
      <Text style={style.title}>Welcome Back 👋 to {appName}</Text>
      <Text style={style.subtitle}>Good to see you again. Login to continue your journey.</Text>
      <Text style={{
        color:"blue",
      
        marginBottom:4,
      }} >Don't have an account </Text>

      <TouchableOpacity onPress={LayoutHandler} style={style.btn}>
        <Text style={style.btnText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  ) : (
   
     <View style={style.greedBox}>
      <Text style={style.title}>Hello 👋 Welcome to {appName}</Text>
      <Text style={style.subtitle}>Create an account to start managing your shop easily</Text>
      <Text  style={{
        color:"blue",
      
        marginBottom:4,
      }}>Already have an account?</Text>

      <TouchableOpacity onPress={LayoutHandler} style={style.btn}>
        <Text style={style.btnText}>Login</Text>
      </TouchableOpacity>
     
    </View>
  )}
  
</Animated.View>
 <Animated.View
  style={{
    transform: [{ translateY: loginAnim }],
    opacity: opacity
  }}
>

      <View style={style.loginContainer}>
         <Text style={style.loginTitle}>Login</Text>
         {/* Email */}
      <TextInput
        placeholder="Email"
       value={email}
       onChangeText={setEmail}
        style={style.loginInput}
        placeholderTextColor="#999"
      />
       <View style={style.loginPasswordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
       onChangeText={setPassword
       }
          style={style.loginPasswordInput}
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>
       {/* Forgot Password */}
      <TouchableOpacity style={style.loginForgotContainer}>
        <Text style={style.loginForgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* Button */}
      <TouchableOpacity style={style.loginButton} onPress={handleLogin}>
        <Text style={style.loginButtonText}>Login</Text>
      </TouchableOpacity>
        </View>  
 </Animated.View>

      </View>
      
    </View>
       </SafeAreaView>            
                
  )
}
const style=StyleSheet.create({
  AuthScreen:{
 backgroundColor:" rgba(230, 235, 247, 0.877)",
       height:900,
       justifyContent:"center",
    alignItems:"center",
  },
  Container:{
    backgroundColor:'white',
    height:"75%",
    width:"90%",
    borderRadius:20,
    overflow: "hidden"
  },
  LoginAuthSlider:{
    backgroundColor:"green",
    height:"30%",
    borderBottomLeftRadius:90,
    borderBottomRightRadius:90
  },
  SignUpAuthSlider: {
  position: "absolute",
  width: "100%",
  height: "30%",
  backgroundColor: "green",
  borderTopLeftRadius: 90,
  borderTopRightRadius: 90,

},
greedBox:{
  height:"100%",
  alignItems:"center",
  justifyContent:"center",
  
},
title: {

  fontSize: 22,
  fontWeight: "bold",
  color: "white",
  marginBottom: 5,
},

subtitle: {
  fontSize: 14,
  color: "white",
  marginBottom: 8,
},

btn: {
  backgroundColor: "white",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 10,
},

btnText: {
  color: "green",
  fontWeight: "bold",
},
loginContainer:{
  top:"40%",
},
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center"
  },
  loginInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginHorizontal:10,
    marginBottom: 15
  },
  loginPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
     marginHorizontal:10,
    marginBottom: 10
  },

  loginPasswordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  loginForgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20
  },

  loginForgotText: {
    color: "blue"
  },
loginButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  signupContainer: {
   
  bottom: -150,    
  marginTop: 0,
  paddingHorizontal: 10,
},

signupTitle: {
  fontSize: 26,
  fontWeight: "bold",
  marginBottom: 25,
  textAlign: "center",
},

row: {
  flexDirection: "row",
  marginBottom: 15,
},

input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  marginBottom: 15,
},

passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  paddingHorizontal: 10,
  marginBottom: 20,
},

passwordInput: {
  flex: 1,
  paddingVertical: 12,
},

signupButton: {
  backgroundColor: "green",
  padding: 15,
  borderRadius: 10,
  alignItems: "center",
},

signupButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
}
)