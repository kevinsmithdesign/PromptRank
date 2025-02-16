import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";

const termsAndConditions = [
  {
    title: "Last Updated: February 16, 2025",
    subsections: [
      {
        content:
          "Please read these Terms and Conditions carefully before using PromptRank.",
      },
    ],
  },
  {
    title: "1. Account Terms",
    subsections: [
      {
        content:
          "By creating an account on PromptRank, you agree to provide accurate and complete information during registration. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.",
      },
    ],
  },
  {
    title: "2. User Content",
    subsections: [
      {
        title: "2.1 Content Creation and Ownership",
        content:
          "When you create and post content on PromptRank, including prompts, comments, collections, and reactions, you retain ownership of your User Content. You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your User Content on the Service.",
      },
      {
        title: "2.2 Content Restrictions",
        content:
          "You agree not to post content that is illegal, infringes on intellectual property rights, contains malicious code, is spam or misleading, promotes hate speech, or violates any applicable laws or regulations.",
      },
      {
        title: "2.3 Content Moderation",
        content:
          "We reserve the right to remove any User Content at our sole discretion without notice, terminate or suspend accounts that violate these Terms, and modify or discontinue any aspect of the Service at any time.",
      },
    ],
  },
  {
    title: "3. Privacy and Data Collection",
    subsections: [
      {
        content:
          "We collect and process user data including email address, full name, username, and additional information as needed for Service improvements. We are committed to protecting your privacy and handling your data securely.",
      },
    ],
  },
  {
    title: "4. User Interactions",
    subsections: [
      {
        title: "4.1 Community Guidelines",
        content:
          "When interacting with other users through comments, reactions, or collections, you agree to respect other users' rights and opinions, not engage in harassment or abusive behavior, and not impersonate other users or entities.",
      },
      {
        title: "4.2 Collections",
        content:
          "When creating and managing collections, you are responsible for the content you include. We reserve the right to remove collections that violate these Terms.",
      },
    ],
  },
  {
    title: "5. Service Modifications",
    subsections: [
      {
        content:
          "We reserve the right to modify or discontinue any part of the Service without notice, update these Terms at any time, and notify users of significant changes to these Terms.",
      },
    ],
  },
  {
    title: "6. Termination",
    subsections: [
      {
        content:
          "We may terminate or suspend your account at our sole discretion, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.",
      },
    ],
  },
  {
    title: "7. Limitation of Liability",
    subsections: [
      {
        content:
          "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.",
      },
    ],
  },
  {
    title: "8. Changes to Terms",
    subsections: [
      {
        content:
          "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.",
      },
    ],
  },
];

const TermsAndConditions = ({ termsModalOpen, handleCloseTermsModal }) => {
  return (
    <Dialog
      fullScreen
      open={termsModalOpen}
      onClose={handleCloseTermsModal}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#111",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
          mx: "auto",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogContent
          sx={{
            py: 4,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0,0,0,0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Terms and Conditions
            </Typography>

            <Stack spacing={4}>
              {termsAndConditions.map((section, index) => (
                <Stack key={index} spacing={2}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {section.title}
                  </Typography>

                  {section.subsections?.map((subsection, subIndex) => (
                    <Stack key={subIndex} spacing={1}>
                      {subsection.title && (
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                        >
                          {subsection.title}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {subsection.content}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ))}
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button variant="contained" onClick={handleCloseTermsModal}>
                Close
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default TermsAndConditions;
