"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/lib/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { tokens } from "@/lib/theme";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading || !isAuthenticated) {
    return (
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: tokens.bg,
        }}
      >
        <CircularProgress size={26} sx={{ color: tokens.accent }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: tokens.bg }}>
      <AdminSidebar />
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
