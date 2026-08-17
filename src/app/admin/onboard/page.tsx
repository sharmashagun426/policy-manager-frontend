"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// MUI Components
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

// MUI Icons
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";

// --- Validation Schemas ---
const orgSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  code: z.string().min(2, "Code required").toUpperCase(),
  domain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, "Invalid domain (e.g. coforge.com)"),
  contactName: z.string().min(2, "Contact name required"),
  contactRole: z.string().min(2, "Role required"),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().min(10, "Valid phone number required"),
});

const empSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number required"),
  status: z.string(),
  role: z.string().min(2, "Role is required"),
  designation: z.string().min(2, "Designation is required"),
  empCode: z.string().min(2, "Employee code is required"),
});

type OrgData = z.infer<typeof orgSchema>;
type EmpData = z.infer<typeof empSchema>;

export default function MuiOnboardingForm() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Forms initialization
  const { control: orgControl, handleSubmit: handleOrgSubmit, reset: resetOrg, formState: { errors: orgErrors } } = useForm<OrgData>({
    resolver: zodResolver(orgSchema),
  });

  const { control: empControl, handleSubmit: handleEmpSubmit, reset: resetEmp, formState: { errors: empErrors } } = useForm<EmpData>({
    resolver: zodResolver(empSchema),
    defaultValues: { status: "Active" },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSuccess(false);
  };

  const onSubmit = async (data: OrgData | EmpData) => {
    setLoading(true);
    console.log("Submitted Data:", data);
    
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
    tabIndex === 0 ? resetOrg() : resetEmp();
  };

  return (
    <Container maxWidth="md" >
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ bgcolor: "primary.main", color: "white", p: 3, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            Policy Bot Onboarding
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            Register your organization or manage internal team members
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8f9fa" }}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            centered 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<BusinessIcon />} label="Organization / Vendor" sx={{ fontWeight: 'bold' }} />
            <Tab icon={<PersonAddIcon />} label="Internal Employee" sx={{ fontWeight: 'bold' }} />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
              Successfully onboarded {tabIndex === 0 ? "Organization" : "Employee"}!
            </Alert>
          )}

          {tabIndex === 0 ? (
            /* ORGANIZATION FORM */
            <form onSubmit={handleOrgSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="name"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Organization Name" fullWidth error={!!orgErrors.name} helperText={orgErrors.name?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="code"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Org Code" fullWidth placeholder="COFORGE" error={!!orgErrors.code} helperText={orgErrors.code?.message} inputProps={{ style: { textTransform: "uppercase" } }} />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="domain"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Company Domain" fullWidth placeholder="example.com" error={!!orgErrors.domain} helperText={orgErrors.domain?.message} />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Typography variant="caption" color="textSecondary">CONTACT PERSON DETAILS</Typography></Divider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactName"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Full Name" fullWidth error={!!orgErrors.contactName} helperText={orgErrors.contactName?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactRole"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Role / Designation" fullWidth error={!!orgErrors.contactRole} helperText={orgErrors.contactRole?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactEmail"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Email Address" fullWidth error={!!orgErrors.contactEmail} helperText={orgErrors.contactEmail?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactPhone"
                    control={orgControl}
                    render={({ field }) => (
                      <TextField {...field} label="Phone Number" fullWidth error={!!orgErrors.contactPhone} helperText={orgErrors.contactPhone?.message} />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ mt: 4, py: 1.5, borderRadius: 2 }}
              >
                {loading ? "Registering..." : "Onboard Organization"}
              </Button>
            </form>
          ) : (
            /* EMPLOYEE FORM */
            <form onSubmit={handleEmpSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="fullName"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Employee Full Name" fullWidth error={!!empErrors.fullName} helperText={empErrors.fullName?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="empCode"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Employee Code" fullWidth error={!!empErrors.empCode} helperText={empErrors.empCode?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Work Email" fullWidth error={!!empErrors.email} helperText={empErrors.email?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Phone Number" fullWidth error={!!empErrors.phone} helperText={empErrors.phone?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="status"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} select label="Status" fullWidth>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Probation">Probation</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="role"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Department/Role" fullWidth error={!!empErrors.role} helperText={empErrors.role?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="designation"
                    control={empControl}
                    render={({ field }) => (
                      <TextField {...field} label="Designation" fullWidth error={!!empErrors.designation} helperText={empErrors.designation?.message} />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                sx={{ mt: 4, py: 1.5, borderRadius: 2 }}
              >
                {loading ? "Adding Employee..." : "Add Employee Record"}
              </Button>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
}