import { Stack, Box } from "@mui/material";
import { tokens } from "@/lib/theme";

export default function TypingIndicator() {
  return (
    <Stack direction="row" spacing={0.6} sx={{ py: 0.3 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: tokens.textMuted,
            animation: "pulse-dot 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Stack>
  );
}
