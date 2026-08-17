"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { ChatMessage, Citation } from "@/features/chat/types";
import { newMessageId } from "@/shared/utils/ids";
import { tokens } from "@/lib/theme";
import MessageBubble from "./MessageBubble";
import SuggestedQuestions from "./SuggestedQuestions";
import ChatInput from "./ChatInput";
import SourceDrawer from "./SourceDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage, submitQuestion } from "@/store/chatSlice";

const suggestedQuestions = [
  "How many paid leave days do I get per year?",
  "What is the process to claim travel expenses?",
  "What counts as a reportable security incident?",
  "How do I onboard a new vendor?",
];

export default function ChatShell() {
  const { messages, pending } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCitations, setDrawerCitations] = useState<Citation[]>([]);
  const [activeCitationId, setActiveCitationId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: newMessageId(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const streamingId = newMessageId();
    const streamingMsg: ChatMessage = {
      id: streamingId,
      role: "assistant",
      content: "",
      isStreaming: true,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(userMsg));
    dispatch(addMessage(streamingMsg));
    await dispatch(submitQuestion({ question: text, streamingId }));
  };

  const handleCiteClick = (citationId: string, all: Citation[]) => {
    setDrawerCitations(all);
    setActiveCitationId(citationId);
    setDrawerOpen(true);
  };

  const hasOnlyGreeting = messages.length === 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 760,
        mx: "auto",
        width: "100%",
      }}
    >
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        <Stack spacing={3}>
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onCiteClick={(cid) => handleCiteClick(cid, m.citations || [])}
            />
          ))}
        </Stack>

        {hasOnlyGreeting && !pending && (
          <Box sx={{ mt: 4, maxWidth: 420 }}>
            <SuggestedQuestions
              questions={suggestedQuestions}
              onPick={(q) => handleSend(q)}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2.5, sm: 3 } }}>
        <ChatInput onSend={handleSend} disabled={pending} />
        <Stack
          direction="row"
          spacing={0.6}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 1.5 }}
        >
          <VerifiedRoundedIcon sx={{ fontSize: 13, color: tokens.textMuted }} />
          <Typography variant="caption" sx={{ color: tokens.textMuted }}>
            Answers are grounded in indexed organizational documents only.
          </Typography>
        </Stack>
      </Box>

      <SourceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        citations={drawerCitations}
        activeId={activeCitationId}
      />
    </Box>
  );
}
