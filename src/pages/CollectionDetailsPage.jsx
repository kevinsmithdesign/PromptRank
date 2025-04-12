import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Typography,
  Card,
  CardContent,
  Alert,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { useCollections } from "../hooks/useCollections";
import { usePrompts } from "../hooks/usePrompts";
import PromptCard from "../components/PromptCard";
import { auth } from "../../config/firebase";
import BackIcon from "../icons/BackIcon";

const CollectionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    collections,
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useCollections();

  const {
    prompts: allPrompts,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePrompts();

  if (collectionsLoading || promptsLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (collectionsError || promptsError) {
    return <Alert severity="error">Error loading collection data</Alert>;
  }

  const collection = collections?.find((c) => c.id === id);

  if (!collection) {
    return <Alert severity="error">Collection not found</Alert>;
  }

  const promptIds = collection.prompts?.map((p) => p.id) || [];
  const collectionPrompts =
    allPrompts?.filter((prompt) => promptIds.includes(prompt.id)) || [];

  const handleBack = () => {
    navigate("/main/profile", { replace: true });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        {collection.name}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  background: "#444",
                  p: 2,
                  "&:hover": { background: "#333" },
                }}
              >
                <BackIcon />
              </IconButton>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" color="#fff" fontWeight="bold">
                Collection Details
              </Typography>
              <Typography color="white">
                {collection.prompts?.length || 0} Prompts
              </Typography>
              {collection.description && (
                <Typography color="white" sx={{ mt: 1 }}>
                  {collection.description}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h4" fontWeight="bold" mb={2}>
        Prompts in Collection
      </Typography>

      {!collectionPrompts?.length ? (
        <Typography>No prompts in this collection yet.</Typography>
      ) : (
        <PromptCard
          loading={false}
          promptList={collectionPrompts}
          filteredPrompts={[]}
          searchQuery=""
          selectedCategory=""
          handleMenuOpen={() => {}}
          handleMenuClose={() => {}}
          menuAnchorEl={null}
          selectedPromptId={null}
          handleEditClick={() => {}}
          handleDeleteClick={() => {}}
          handleSavePrompt={() => {}}
          auth={auth}
          navigate={navigate}
          theme={theme}
        />
      )}
    </Box>
  );
};

export default CollectionDetailsPage;
