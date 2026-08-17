"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { tokens } from "@/lib/theme";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/admin/dashboard");
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError(res.error ?? "Something went wrong.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: tokens.bg,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 380,
          bgcolor: tokens.paper,
          border: `1px solid ${tokens.border}`,
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Logo size={28} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Admin sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your organization&apos;s document library.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Work email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              fullWidth
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" sx={{ color: tokens.textMuted, display: "block" }}>
          Demo build — any work email and a password of 4+ characters will sign you in.
        </Typography>
      </Box>
    </Box>
  );
}
