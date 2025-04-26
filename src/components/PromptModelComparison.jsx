import React, { useState } from "react";
import { Alert } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, Stack } from "@mui/material";
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

  // Model rank labels (A, B, C, D)
  const modelRankLabels = ["A", "B", "C", "D"];

  // State for the prompt, selected models, and voting
  const [prompt, setPrompt] = useState(
    "Explain the concept of prompt engineering in AI and how it affects model outputs."
  );
  const [selectedModels, setSelectedModels] = useState([
    "claude-3-opus",
    "gpt-4",
  ]);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponses, setGeneratedResponses] = useState({});
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedModelIds, setGeneratedModelIds] = useState(new Set());

  // Function to add a new model
  const addModel = () => {
    if (selectedModels.length < 4) {
      const availableModel = availableModels.find(
        (model) => !selectedModels.includes(model.id)
      );
      if (availableModel) {
        setSelectedModels([...selectedModels, availableModel.id]);
        setHasGenerated(false);
        // Reset generation state when adding a new model
        setGeneratedModelIds(new Set());
      }
    }
  };

  // Function to remove a model
  const removeModel = (modelId) => {
    if (selectedModels.length > 2) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId));
      setHasGenerated(false);
      // Reset generation state when removing a model
      setGeneratedModelIds(new Set());
    }
  };

  // Function to change a model
  const changeModel = (index, newModelId) => {
    const newSelectedModels = [...selectedModels];
    newSelectedModels[index] = newModelId;
    setSelectedModels(newSelectedModels);
    setHasGenerated(false);
    // Reset generation state when changing a model
    setGeneratedModelIds(new Set());
  };

  // Function to simulate response generation
  const generateResponse = (modelId) => {
    let text = "";
    const interval = setInterval(() => {
      if (text.length < sampleResponses[modelId].length) {
        text = sampleResponses[modelId].slice(0, text.length + 3);
        setGeneratedResponses((prev) => ({
          ...prev,
          [modelId]: text,
        }));
      } else {
        clearInterval(interval);
        setGeneratedModelIds((prev) => new Set([...prev, modelId]));
        if (modelId === selectedModels[selectedModels.length - 1]) {
          setIsGenerating(false);
          setHasGenerated(true);
        }
      }
    }, 20);
  };

  // Check if all current models have been generated
  const areAllModelsGenerated = selectedModels.every((modelId) =>
    generatedModelIds.has(modelId)
  );

  // Function to start response generation
  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedResponses({});

    selectedModels.forEach((modelId, index) => {
      setTimeout(() => {
        generateResponse(modelId);
      }, index * 1000);
    });
  };

  // Function to get alert content based on selection
  const getAlertContent = () => {
    if (!selectedWinner) return null;

    if (selectedWinner === "tie") {
      return {
        severity: "info",
        message: "You voted that multiple models were equally good",
        style: {
          bgcolor: "rgba(2, 136, 209, 0.3)", // Increased opacity for better visibility
          "& .MuiAlert-icon": { color: "#03a9f4" },
          color: "#fff", // White text for better contrast
          fontWeight: "medium",
        },
      };
    }

    if (selectedWinner === "none") {
      return {
        severity: "warning",
        message: "You voted that none of the responses were satisfactory",
        style: {
          bgcolor: "rgba(237, 108, 2, 0.3)", // Increased opacity
          "& .MuiAlert-icon": { color: "#ff9800" },
          color: "#fff", // White text
          fontWeight: "medium",
        },
      };
    }

    // For model selection
    return {
      severity: "success",
      message: `You voted for ${
        availableModels.find((m) => m.id === selectedWinner)?.name
      } (Model ${modelRankLabels[selectedModels.indexOf(selectedWinner)]})`,
      style: {
        bgcolor: "rgba(46, 125, 50, 0.3)", // Increased opacity
        "& .MuiAlert-icon": { color: "#4caf50" },
        color: "#fff", // White text
        fontWeight: "medium",
      },
    };
  };

  const alertContent = getAlertContent();

  return (
    <Box sx={{ mx: "auto" }}>
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} md={8}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "#999",
              fontSize: { xs: "1.75rem", sm: "2rem" },
            }}
          >
            Prompt Model Comparison
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          {selectedModels.length < 4 && (
            <Button
              variant="contained"
              startIcon={<span>+</span>}
              onClick={addModel}
              color="primary"
              size="large"
              sx={{
                height: "48px",

                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add Model
            </Button>
          )}
        </Grid>
      </Grid>

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
                  Model {modelRankLabels[index]}
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
                      borderColor: "#333",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
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
                bgcolor: "#222",

                overflow: "auto",
                borderRadius: "16px",
                border:
                  selectedWinner === modelId
                    ? "2px solid #4caf50"
                    : "1px solid #333",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color:
                    !generatedResponses[modelId] && !isGenerating
                      ? "rgba(255,255,255,0.7)"
                      : "#fff",
                  lineHeight: 1.6,
                }}
              >
                {isGenerating
                  ? generatedResponses[modelId] || (
                      <Box component="span" sx={{ opacity: 0.7 }}>
                        Generating response...
                      </Box>
                    )
                  : generatedResponses[modelId]
                  ? generatedResponses[modelId]
                  : "Click 'Generate Responses' to see how this model would respond to your prompt. Compare different models to find the best one for your needs."}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Generate responses button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={
            isGenerating ||
            (hasGenerated && generatedResponses[selectedModels[0]])
          }
          size="large"
          sx={{
            height: "48px",
            fontSize: "1rem",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {isGenerating
            ? "Generating..."
            : hasGenerated && generatedResponses[selectedModels[0]]
            ? "Responses Generated"
            : "Generate Responses"}
        </Button>
      </Box>

      {/* Voting section */}
      <Box sx={{ mt: 4, mb: 4, p: 4, bgcolor: "#222", borderRadius: "16px" }}>
        {/* Show alert above the title if there is a selection */}
        {alertContent && (
          <Alert
            severity={alertContent.severity}
            sx={{
              mb: 3,
              ...alertContent.style,
              fontSize: "1rem", // Larger font size
              py: 1.5, // More padding
            }}
          >
            {alertContent.message}
          </Alert>
        )}

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#fff", mb: 3 }}
        >
          Vote for the Best Response
        </Typography>

        <Typography variant="body1" color="#ddd" mb={3}>
          Which model do you think provided the best response to your prompt?
        </Typography>

        <Stack flexDirection={{ xs: "column", md: "row" }} gap={2}>
          {selectedModels.map((modelId, index) => (
            <Stack key={modelId}>
              <Button
                variant={selectedWinner === modelId ? "contained" : "outlined"}
                color="primary"
                onClick={() => setSelectedWinner(modelId)}
                sx={{
                  px: 3,
                  py: 1, // Taller buttons
                  width: { xs: "100%", sm: "auto" },
                  borderColor: selectedWinner === modelId ? "primary" : "#666",
                  "&:hover": {
                    borderColor: "#888",
                  },
                }}
              >
                Model {modelRankLabels[index]}
              </Button>
            </Stack>
          ))}

          <Stack>
            <Button
              variant={selectedWinner === "tie" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedWinner("tie")}
              sx={{
                px: 3,
                py: 1,
                width: { xs: "100%", sm: "auto" },
                borderColor: selectedWinner === "tie" ? "primary" : "#666",
                "&:hover": {
                  borderColor: "#888",
                },
              }}
            >
              Tie
            </Button>
          </Stack>

          <Stack>
            <Button
              variant={selectedWinner === "none" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedWinner("none")}
              sx={{
                px: 3,
                py: 1,
                borderColor: selectedWinner === "none" ? "primary" : "#666",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  borderColor: "#888",
                },
              }}
            >
              None were good
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Compare stats section */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#fff", mb: 1.5 }}
        >
          Response Stats
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ background: "#222", p: 4 }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="#fff"
                mb={2.5}
              >
                Response Length
              </Typography>
              {selectedModels.map((modelId, index) => {
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
                    <Typography variant="body2">
                      Model {modelRankLabels[index]} ({model.name})
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {length} chars
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ background: "#222", p: 4 }}>
              <Typography
                variant="body1"
                color="white"
                fontWeight="bold"
                mb={2.5}
              >
                Response Time
              </Typography>
              {selectedModels.map((modelId, index) => {
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
                    <Typography variant="body2">
                      Model {modelRankLabels[index]} ({model.name})
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {times[modelId]}
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ background: "#222", p: 4 }}>
              <Typography
                variant="body1"
                color="white"
                fontWeight="bold"
                mb={2.5}
              >
                Token Usage
              </Typography>
              {selectedModels.map((modelId, index) => {
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
                    <Typography variant="body2">
                      Model {modelRankLabels[index]} ({model.name})
                    </Typography>
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
