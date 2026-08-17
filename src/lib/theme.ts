"use client";

import { createTheme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// Design tokens
// PolicyBot is a system of record for organizational knowledge — the palette
// leans toward "verified document" rather than generic chat-app cheer:
// an ink-navy surface, a single deep-verdigris accent that reads as
// "confirmed / sourced", and warm amber reserved strictly for in-progress
// states. Citation numerals and metadata are set in JetBrains Mono, the same
// way a legal brief or a spec sheet sets reference marks in a fixed-width
// face — it's the one deliberate typographic accent in the system.
// ---------------------------------------------------------------------------
export const tokens = {
  ink: "#11162A", // near-black navy — sidebar, headers, high-emphasis text
  inkSoft: "#3B4256",
  paper: "#FFFFFF",
  bg: "#F3F4F7", // app canvas
  bgSunken: "#EAEBF0",
  border: "#E1E3EA",
  borderStrong: "#CBCEDA",
  accent: "#1C6B5A", // verdigris — "verified / sourced"
  accentSoft: "#E3EFEC",
  accentStrong: "#124F42",
  amber: "#B5750F", // processing / attention
  amberSoft: "#FBF0DD",
  red: "#B23A2E", // failed / destructive
  redSoft: "#FBEAE7",
  textPrimary: "#181D2E",
  textSecondary: "#5B6172",
  textMuted: "#8A8FA0",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.accent,
      dark: tokens.accentStrong,
      light: "#2E8A73",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: tokens.ink,
      contrastText: "#FFFFFF",
    },
    warning: {
      main: tokens.amber,
      contrastText: "#FFFFFF",
    },
    error: {
      main: tokens.red,
    },
    success: {
      main: tokens.accent,
    },
    background: {
      default: tokens.bg,
      paper: tokens.paper,
    },
    text: {
      primary: tokens.textPrimary,
      secondary: tokens.textSecondary,
    },
    divider: tokens.border,
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", -apple-system, sans-serif',
    h1: { fontWeight: 650, letterSpacing: "-0.02em" },
    h2: { fontWeight: 650, letterSpacing: "-0.02em" },
    h3: { fontWeight: 650, letterSpacing: "-0.01em" },
    h4: { fontWeight: 650, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.85rem" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.bg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          paddingLeft: 16,
          paddingRight: 16,
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: tokens.textSecondary,
          backgroundColor: tokens.bgSunken,
          borderBottom: `1px solid ${tokens.border}`,
        },
        body: {
          borderBottom: `1px solid ${tokens.border}`,
        },
      },
    },
  },
});

export default theme;
