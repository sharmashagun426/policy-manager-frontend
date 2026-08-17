"use client";

import { Box, Stack, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { tokens } from "@/lib/theme";

export default function SuggestedQuestions({
  questions,
  onPick,
}: {
  questions: string[];
  onPick: (q: string) => void;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: tokens.textMuted,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontSize: "0.68rem",
        }}
      >
        Try asking
      </Typography>
      <Stack spacing={1} mt={1.25}>
        {questions.map((q) => (
          <Box
            key={q}
            component="button"
            onClick={() => onPick(q)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              textAlign: "left",
              width: "100%",
              px: 1.75,
              py: 1.25,
              borderRadius: 2,
              border: `1px solid ${tokens.border}`,
              bgcolor: tokens.paper,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "border-color 150ms ease, background-color 150ms ease",
              "&:hover": {
                borderColor: tokens.accent,
                bgcolor: tokens.accentSoft,
              },
            }}
          >
            <Typography variant="body2" sx={{ color: tokens.textPrimary }}>
              {q}
            </Typography>
            <ArrowOutwardRoundedIcon
              sx={{ fontSize: 16, color: tokens.textMuted, flexShrink: 0 }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
