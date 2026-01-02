import { router } from "expo-router";
import { useEffect } from "react";

export default function RedirectCreate() {
  useEffect(() => {
    router.push('/post/create');
  }, []);

  return null;
}
