"use client";

import { useState, KeyboardEvent } from "react";
import { Box, IconButton, InputBase, Stack, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { tokens } from "@/lib/theme";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={1}
        sx={{
          border: `1.5px solid ${tokens.border}`,
          borderRadius: 3,
          bgcolor: tokens.paper,
          p: "6px 6px 6px 16px",
          "&:focus-within": {
            borderColor: tokens.accent,
          },
        }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={5}
          placeholder="Ask about a policy, process, or document…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ fontSize: "0.95rem", py: 0.8 }}
        />
        <IconButton
          onClick={submit}
          disabled={!value.trim() || disabled}
          sx={{
            bgcolor: value.trim() ? tokens.accent : tokens.bgSunken,
            color: value.trim() ? "#fff" : tokens.textMuted,
            width: 34,
            height: 34,
            "&:hover": {
              bgcolor: value.trim() ? tokens.accentStrong : tokens.bgSunken,
            },
            "&.Mui-disabled": {
              bgcolor: tokens.bgSunken,
              color: tokens.textMuted,
            },
          }}
        >
          <ArrowUpwardRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Typography
        variant="caption"
        sx={{ color: tokens.textMuted, display: "block", mt: 0.9, ml: 0.5 }}
      >
        PolicyBot answers only from documents uploaded by your organization.
      </Typography>
    </Box>
  );
}
