import { Box } from "@mui/material";
import PublicHeader from "@/components/chat/PublicHeader";
import ChatShell from "@/components/chat/ChatShell";
import { tokens } from "@/lib/theme";

export default function HomePage() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: tokens.bg,
      }}
    >
      <PublicHeader />
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <ChatShell />
      </Box>
    </Box>
  );
}
