"use client";

import Link from "next/link";
import { Box, Stack, Typography, Button } from "@mui/material";
import { tokens } from "@/lib/theme";
import Logo from "../Logo";

export default function PublicHeader() {
  return (
    <Box
      component="header"
      sx={{
        borderBottom: `1px solid ${tokens.border}`,
        bgcolor: tokens.paper,
        px: { xs: 2, sm: 3 },
        py: 1.5,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ maxWidth: 1080, mx: "auto" }}
      >
        <Logo />
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Typography
            variant="body2"
            sx={{ color: tokens.textSecondary, display: { xs: "none", sm: "block" } }}
          >
            AI Internal Portal Assistant
          </Typography>
          <Button
            component={Link}
            href="/admin/login"
            variant="outlined"
            size="small"
            sx={{
              borderColor: tokens.border,
              color: tokens.textPrimary,
              "&:hover": { borderColor: tokens.accent, bgcolor: tokens.accentSoft },
            }}
          >
            Admin login
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
