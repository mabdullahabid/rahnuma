"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

// List of paths that require authentication
const PROTECTED_PATHS = [
  "/prd",
  "/prd/create",
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isProtectedPath) {
      // Store the intended destination to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, pathname, router, isProtectedPath]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated && isProtectedPath) {
    // This prevents the protected content from flashing before redirect
    return null;
  }

  return <>{children}</>;
}