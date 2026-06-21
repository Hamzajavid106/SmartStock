import { useEffect, useState } from "react";
import { supabase } from "../Lib/supabase";
import { Redirect } from "expo-router";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Redirect href="/(auth)/auth" />;
  }

  return <Redirect href="/(root)/(tabs)" />;
}