"use client";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { ChatMessage } from "@/features/chat/types";
import { tokens } from "@/lib/theme";
import CitationChip from "./CitationChip";
import TypingIndicator from "./TypingIndicator";

export default function MessageBubble({
  message,
  onCiteClick,
}: {
  message: ChatMessage;
  onCiteClick: (citationId: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        animation: "soft-fade-up 260ms ease",
      }}
    >
      <Avatar
        sx={{
          width: 30,
          height: 30,
          fontSize: 14,
          bgcolor: isUser ? tokens.ink : tokens.accent,
          mt: 0.3,
        }}
      >
        {isUser ? <PersonRoundedIcon sx={{ fontSize: 16 }} /> : "P"}
      </Avatar>

      <Box sx={{ maxWidth: "78%" }}>
        <Box
          sx={{
            bgcolor: isUser ? tokens.ink : tokens.paper,
            color: isUser ? "#fff" : tokens.textPrimary,
            border: isUser ? "none" : `1px solid ${tokens.border}`,
            borderRadius: 2.5,
            borderTopRightRadius: isUser ? 4 : 20,
            borderTopLeftRadius: isUser ? 20 : 4,
            px: 2,
            py: 1.4,
          }}
        >
          {message.isStreaming ? (
            <TypingIndicator />
          ) : (
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.65, whiteSpace: "pre-wrap" }}
            >
              {message.content}
            </Typography>
          )}
        </Box>

        {!!message.citations?.length && !message.isStreaming && (
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
            sx={{ mt: 1, px: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{ color: tokens.textMuted, mr: 0.5 }}
            >
              Sources
            </Typography>
            {message.citations.map((c, i) => (
              <CitationChip
                key={c.id}
                index={i + 1}
                onClick={() => onCiteClick(c.id)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
