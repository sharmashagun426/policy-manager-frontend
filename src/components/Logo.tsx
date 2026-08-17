import { Box, Stack, Typography } from "@mui/material";

export default function Logo({
  variant = "dark",
  size = 30,
}: {
  variant?: "dark" | "light";
  size?: number;
}) {
  const fg = variant === "dark" ? "#11162A" : "#FFFFFF";
  const accent = "#1C6B5A";
  return (
    <Stack direction="row" spacing={1.1} alignItems="center">
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "8px",
          bgcolor: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16 4v3h3" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 12h8M8 15.5h5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Box>
      <Typography
        sx={{
          color: fg,
          fontWeight: 700,
          fontSize: size * 0.6,
          letterSpacing: "-0.01em",
        }}
      >
        PolicyBot
      </Typography>
    </Stack>
  );
}
