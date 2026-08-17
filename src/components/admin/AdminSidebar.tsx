"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Stack, Typography, Divider, Avatar } from "@mui/material";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { tokens } from "@/lib/theme";
import { useAuth } from "@/lib/AuthContext";
import Logo from "../Logo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: SpaceDashboardRoundedIcon },
  { href: "/admin/documents", label: "Documents", icon: DescriptionRoundedIcon },
  { href: "/admin/onboard", label: "Onboarding", icon: GroupAddRoundedIcon },
];

export default function AdminSidebar() { 
  const pathname = usePathname();
  const router = useRouter();
  const { logout, userEmail, orgName } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: tokens.ink,
        color: "#fff",
        height: "100dvh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 2.5,
      }}
    >
      <Box sx={{ px: 0.5, mb: 3 }}>
        <Logo variant="light" size={26} />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.5,
                py: 1.1,
                borderRadius: 2,
                textDecoration: "none",
                color: active ? "#fff" : "rgba(255,255,255,0.62)",
                bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
                transition: "background-color 150ms ease, color 150ms ease",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "#fff",
                },
              }}
            >
              <Icon sx={{ fontSize: 19 }} />
              <Typography variant="body2" fontWeight={600}>
                {item.label}
              </Typography>
            </Box>
          );
        })}

        <Box
          component={Link}
          href="/"
          target="_blank"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.5,
            py: 1.1,
            borderRadius: 2,
            textDecoration: "none",
            color: "rgba(255,255,255,0.62)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.06)", color: "#fff" },
          }}
        >
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 19 }} />
          <Typography variant="body2" fontWeight={600}>
            View chatbot
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1.5 }} />

      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ px: 0.5, mb: 1.5 }}>
        <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: tokens.accent }}>
          {userEmail?.[0]?.toUpperCase() ?? "A"}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ color: "#fff" }}>
            {userEmail ?? "admin@org.com"}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: "rgba(255,255,255,0.5)" }}>
            {orgName}
          </Typography>
        </Box>
      </Stack>

      <Box
        component="button"
        onClick={handleLogout}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.1,
          px: 1.5,
          py: 1,
          borderRadius: 2,
          border: "none",
          bgcolor: "transparent",
          color: "rgba(255,255,255,0.62)",
          cursor: "pointer",
          fontFamily: "inherit",
          "&:hover": { bgcolor: "rgba(255,255,255,0.06)", color: "#fff" },
        }}
      >
        <LogoutRoundedIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" fontWeight={600}>
          Sign out
        </Typography>
      </Box>
    </Box>
  );
}
