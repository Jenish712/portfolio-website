import { useState, useEffect } from "react";

// Parse the current hash to determine the route
export function parseRoute(hash) {
  const h = hash.replace(/^#/, "");
  if (h.startsWith("/project/")) {
    const slug = h.split("/project/")[1]?.split("?")[0] || "";
    return { name: "project", slug };
  }
  return { name: "home" };
}

// Hook to manage hash-based routing
export function useHashRoute() {
  const [route, setRoute] = useState(parseRoute(window.location.hash));
  
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  
  return route;
}

// Navigate to a project page
export function goProject(slug, newTab = false) {
  const url = `#/project/${slug}`;
  if (newTab) window.open(url, "_blank");
  else window.location.hash = url;
}