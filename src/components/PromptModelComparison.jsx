import React, { useState } from "react";
import { Alert } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TextField, Typography, Grid, Box, IconButton } from "@mui/material";
import { Divider } from "@mui/material";

const PromptModelComparison = () => {
  // Sample data for demonstration
  const availableModels = [
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "llama-3", name: "Llama 3" },
  ];

  // Sample responses for each model
  const sampleResponses = {
    "claude-3-opus":
      "Claude 3 Opus response: This is a detailed response with nuanced understanding of the prompt. I've considered multiple perspectives and provided a comprehensive analysis.",
    "claude-3-sonnet":
      "Claude 3 Sonnet response: Here's a balanced response that addresses the key aspects of your prompt while maintaining good detail and accuracy.",
    "claude-3-haiku":
      "Claude 3 Haiku response: A concise answer addressing the core of your question efficiently.",
    "gpt-4":
      "GPT-4 response: I've analyzed your prompt in depth and here are my thoughts on the subject with relevant examples and considerations.",
    "gpt-3.5-turbo":
      "GPT-3.5 Turbo response: Here's what I think about your prompt based on my training data. Let me know if you need more information.",
    "llama-3":
      "Llama 3 response: This is my interpretation of your prompt based on my open-source training. I've aimed to be helpful and accurate.",
  };

  // State for the prompt and selected models
  const [prompt, setPrompt] = useState(
    "Explain the concept of prompt engineering in AI and how it affects model outputs."
  );
  const [selectedModels, setSelectedModels] = useState([
    "claude-3-opus",
    "gpt-4",
  ]);

  // Function to add a new model
  const addModel = () => {
    if (selectedModels.length < 4) {
      // Find first available model not already selected
      const availableModel = availableModels.find(
        (model) => !selectedModels.includes(model.id)
      );
      if (availableModel) {
        setSelectedModels([...selectedModels, availableModel.id]);
      }
    }
  };

  // Function to remove a model
  const removeModel = (modelId) => {
    if (selectedModels.length > 2) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId));
    }
  };

  // Function to change a model
  const changeModel = (index, newModelId) => {
    const newSelectedModels = [...selectedModels];
    newSelectedModels[index] = newModelId;
    setSelectedModels(newSelectedModels);
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{ my: 3, fontWeight: "bold", color: "#fff" }}
      >
        Prompt Model Comparison
      </Typography>

      {/* Model comparison section */}
      <Grid container spacing={2}>
        {selectedModels.map((modelId, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{ width: "100%" }}
              >
                <Typography fontWeight="bold" mb={0.5}>
                  Model
                </Typography>
                <Select
                  value={modelId}
                  sx={{
                    width: "100%",
                    bgcolor: "#222",
                    "& .MuiSelect-select": {
                      color: "#fff",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  }}
                  onChange={(e) => changeModel(index, e.target.value)}
                >
                  {availableModels.map((model) => (
                    <MenuItem
                      key={model.id}
                      value={model.id}
                      disabled={
                        selectedModels.includes(model.id) &&
                        modelId !== model.id
                      }
                    >
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedModels.length > 2 && (
                <IconButton
                  size="small"
                  onClick={() => removeModel(modelId)}
                  color="error"
                  aria-label="Remove model"
                  sx={{ ml: 1 }}
                >
                  <span>✕</span>
                </IconButton>
              )}
            </Box>

            <Box
              sx={{
                p: 4,
                minHeight: 200,
                bgcolor: "#333",
                overflow: "auto",
                borderRadius: "16px",
              }}
            >
              <Typography variant="body2">
                {sampleResponses[modelId]}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Add model button */}
      {selectedModels.length < 4 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<span>+</span>}
            onClick={addModel}
            color="primary"
          >
            Add Model
          </Button>
        </Box>
      )}

      {/* Compare stats section */}
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#fff", mb: 1.5 }}
        >
          Response Stats
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#333", p: 4 }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="#fff"
                mb={2.5}
              >
                Response Length
              </Typography>
              {selectedModels.map((modelId) => {
                const model = availableModels.find((m) => m.id === modelId);
                const length = sampleResponses[modelId].length;
                return (
                  <Box
                    key={modelId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{model.name}</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {length} chars
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#333", p: 4 }}>
              <Typography
                variant="subtitle2"
                color="white"
                fontWeight="bold"
                mb={2.5}
              >
                Response Time
              </Typography>
              {selectedModels.map((modelId) => {
                const model = availableModels.find((m) => m.id === modelId);
                // Mock response times
                const times = {
                  "claude-3-opus": "3.2s",
                  "claude-3-sonnet": "1.8s",
                  "claude-3-haiku": "0.9s",
                  "gpt-4": "2.7s",
                  "gpt-3.5-turbo": "1.1s",
                  "llama-3": "2.3s",
                };
                return (
                  <Box
                    key={modelId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{model.name}</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {times[modelId]}
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#333", p: 4 }}>
              <Typography
                variant="subtitle2"
                color="white"
                fontWeight="bold"
                mb={2.5}
              >
                Token Usage
              </Typography>
              {selectedModels.map((modelId) => {
                const model = availableModels.find((m) => m.id === modelId);
                // Mock token usage
                const tokens = {
                  "claude-3-opus": "328",
                  "claude-3-sonnet": "287",
                  "claude-3-haiku": "196",
                  "gpt-4": "312",
                  "gpt-3.5-turbo": "243",
                  "llama-3": "305",
                };
                return (
                  <Box
                    key={modelId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{model.name}</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {tokens[modelId]} tokens
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PromptModelComparison;
