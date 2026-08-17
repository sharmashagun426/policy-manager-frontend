"use client";

import { FormEvent, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { tokens } from "@/lib/theme";
import {
  executePolicyUpdate,
  searchPolicyUpdate,
} from "@/features/policyUpdate/api/policyUpdateService";
import type {
  PolicyExecuteResponse,
  PolicySearchResult,
} from "@/features/policyUpdate/types";

type Status = "idle" | "searching" | "review" | "updating" | "success";

export default function PolicyUpdateAssistant({ onClose }: { onClose?: () => void }) {
  const [draft, setDraft] = useState("");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState<PolicySearchResult | null>(null);
  const [update, setUpdate] = useState<PolicyExecuteResponse | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value || status === "searching") return;

    setError(null);
    setUpdate(null);
    setResult(null);
    setInstruction(value);
    setStatus("searching");

    try {
      const matches = await searchPolicyUpdate(value);
      if (!matches.length) {
        setError("I couldn't find a policy section that matches this request. Try adding the policy name and current wording.");
        setStatus("idle");
        return;
      }
      setResult(matches[0]);
      setStatus("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search policy documents.");
      setStatus("idle");
    }
  };

  const handleConfirm = async () => {
    if (!result || status !== "review") return;
    setError(null);
    setStatus("updating");

    try {
      const response = await executePolicyUpdate(result, instruction);
      setUpdate(response);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the policy.");
      setStatus("review");
    }
  };

  const reset = () => {
    setDraft("");
    setInstruction("");
    setResult(null);
    setUpdate(null);
    setError(null);
    setStatus("idle");
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", borderColor: tokens.borderStrong }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2.5, py: 2, bgcolor: tokens.ink }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(255,255,255,.1)", display: "grid", placeItems: "center" }}>
          <AutoFixHighRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography fontWeight={700} sx={{ color: "#fff" }}>HR policy assistant</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,.62)" }}>Find, review, and safely update policy text</Typography>
        </Box>
        <Chip label="HR only" size="small" sx={{ ml: "auto !important", bgcolor: "rgba(255,255,255,.1)", color: "#fff" }} />
        {onClose && (
          <IconButton onClick={onClose} aria-label="Close policy assistant" sx={{ color: "rgba(255,255,255,.75)" }}>
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Stack>

      <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ alignSelf: "flex-start", maxWidth: 620, bgcolor: tokens.bgSunken, borderRadius: "4px 14px 14px 14px", px: 2, py: 1.5 }}>
          <Typography variant="body2">Tell me the policy change you want to make. I’ll find the most relevant section and ask you to confirm before changing anything.</Typography>
        </Box>

        {instruction && (
          <Box sx={{ alignSelf: "flex-end", maxWidth: 620, bgcolor: tokens.accent, color: "#fff", borderRadius: "14px 4px 14px 14px", px: 2, py: 1.5 }}>
            <Typography variant="body2">{instruction}</Typography>
          </Box>
        )}

        {status === "searching" && (
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ color: tokens.textSecondary }}>
            <CircularProgress size={18} /><Typography variant="body2">Searching policy documents…</Typography>
          </Stack>
        )}

        {result && (status === "review" || status === "updating") && (
          <Box sx={{ maxWidth: 680, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: tokens.amberSoft }}>
              <Typography fontWeight={700}>Please confirm this update</Typography>
              <Typography variant="body2" color="text.secondary">I’m going to rewrite the matched section below using your instruction.</Typography>
            </Box>
            <Stack spacing={1.5} sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DescriptionRoundedIcon sx={{ fontSize: 19, color: tokens.textSecondary }} />
                <Typography variant="body2" fontWeight={700}>{result.metadata.fileName}</Typography>
                <Chip label={`${Math.round(result.score * 100)}% match`} size="small" variant="outlined" />
              </Stack>
              <Box>
                <Typography variant="caption" color="text.secondary">CURRENT TEXT</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, p: 1.5, bgcolor: tokens.bg, borderRadius: 1.5, whiteSpace: "pre-wrap" }}>{result.metadata.text}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">Document ID: {result.metadata.documentId}</Typography>
              <Divider />
              <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1} justifyContent="flex-end">
                <Button variant="text" disabled={status === "updating"} onClick={reset}>Cancel</Button>
                <Button variant="contained" disabled={status === "updating"} onClick={handleConfirm} startIcon={status === "updating" ? <CircularProgress size={15} color="inherit" /> : <CheckCircleRoundedIcon />}>
                  {status === "updating" ? "Updating…" : "Confirm and update"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {status === "success" && update && (
          <Alert severity="success" icon={<CheckCircleRoundedIcon />} sx={{ maxWidth: 680 }}>
            <Typography variant="body2" fontWeight={700}>{update.message}</Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>UPDATED TEXT</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{update.updatedText}</Typography>
            <Button size="small" onClick={reset} sx={{ mt: 1, ml: -1 }}>Make another update</Button>
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ maxWidth: 680 }}>{error}</Alert>}

        {(status === "idle" || status === "searching") && (
          <Box component="form" onSubmit={handleSearch} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField fullWidth multiline maxRows={4} label="Policy update instruction" placeholder="e.g. Change annual leave from 10 days to 15 days" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={status === "searching"} />
              <Button type="submit" variant="contained" disabled={!draft.trim() || status === "searching"} sx={{ minWidth: 48, height: 48, px: 1.5 }} aria-label="Search policy documents"><SendRoundedIcon /></Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
