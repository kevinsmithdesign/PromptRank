import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Stack,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  Slider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
  LinearProgress,
  Chip,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const availableLLMs = [
  {
    id: "gpt4",
    name: "GPT-4",
    provider: "OpenAI",
    tokenCost: "$0.01/1K tokens",
    responseTime: "Moderate",
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    provider: "OpenAI",
    tokenCost: "$0.01/1K tokens",
    responseTime: "Fast",
  },
  {
    id: "gpt35turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    tokenCost: "$0.0015/1K tokens",
    responseTime: "Very Fast",
  },
  {
    id: "claude3opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    tokenCost: "$0.015/1K tokens",
    responseTime: "Moderate",
  },
  {
    id: "claude3sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    tokenCost: "$0.008/1K tokens",
    responseTime: "Fast",
  },
  {
    id: "claude3haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    tokenCost: "$0.003/1K tokens",
    responseTime: "Very Fast",
  },
  {
    id: "claude2",
    name: "Claude 2",
    provider: "Anthropic",
    tokenCost: "$0.008/1K tokens",
    responseTime: "Fast",
  },
  {
    id: "llama3",
    name: "Llama 3",
    provider: "Meta",
    tokenCost: "Variable",
    responseTime: "Fast",
  },
  {
    id: "llama2",
    name: "Llama 2",
    provider: "Meta",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    provider: "Mistral AI",
    tokenCost: "Variable",
    responseTime: "Fast",
  },
  {
    id: "mixtralNext",
    name: "Mixtral Next",
    provider: "Mistral AI",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "gemini",
    name: "Gemini Pro",
    provider: "Google",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "geminiUltra",
    name: "Gemini Ultra",
    provider: "Google",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "palmeTwo",
    name: "Palm-E 2",
    provider: "Google",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "falcon",
    name: "Falcon",
    provider: "TII",
    tokenCost: "Variable",
    responseTime: "Moderate",
  },
  {
    id: "j2ultra",
    name: "J2 Ultra",
    provider: "AI21 Labs",
    tokenCost: "Variable",
    responseTime: "Fast",
  },
  {
    id: "comandR",
    name: "Command R",
    provider: "Cohere",
    tokenCost: "Variable",
    responseTime: "Fast",
  },
];

const criteria = [
  {
    id: "quality",
    name: "Response Quality",
    description: "Overall quality and helpfulness of the response",
  },
  {
    id: "accuracy",
    name: "Factual Accuracy",
    description: "Correctness of information provided",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Logical reasoning capabilities",
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Creative writing and idea generation",
  },
  {
    id: "code",
    name: "Code Generation",
    description: "Quality of code produced",
  },
  {
    id: "instruction",
    name: "Instruction Following",
    description: "Ability to follow complex instructions",
  },
];

const CompareToolsPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLLMs, setSelectedLLMs] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [comparisonType, setComparisonType] = useState("sideBySide");
  const [selectedCriteria, setSelectedCriteria] = useState([
    "quality",
    "accuracy",
  ]);
  const [responses, setResponses] = useState({});
  const [ratings, setRatings] = useState({});
  const [showResults, setShowResults] = useState(false);

  const toggleLLM = (llmId) => {
    if (selectedLLMs.includes(llmId)) {
      setSelectedLLMs(selectedLLMs.filter((id) => id !== llmId));
    } else {
      setSelectedLLMs([...selectedLLMs, llmId]);
    }
  };

  const toggleCriteria = (criteriaId) => {
    if (selectedCriteria.includes(criteriaId)) {
      setSelectedCriteria(selectedCriteria.filter((id) => id !== criteriaId));
    } else {
      setSelectedCriteria([...selectedCriteria, criteriaId]);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    if (prompt.trim() === "" || selectedLLMs.length === 0) {
      return;
    }
    // Mock response generation
    const newResponses = {};
    selectedLLMs.forEach((llmId) => {
      newResponses[llmId] = generateMockResponse(llmId, prompt);
    });
    setResponses(newResponses);
    setShowResults(true);
  };

  const generateMockResponse = (llmId, prompt) => {
    return {
      quality: Math.random() * 5,
      accuracy: Math.random() * 5,
      reasoning: Math.random() * 5,
      creativity: Math.random() * 5,
      code: Math.random() * 5,
      instruction: Math.random() * 5,
    };
  };

  const updateRating = (llmId, criteriaId, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [llmId]: {
        ...prevRatings[llmId],
        [criteriaId]: value,
      },
    }));
  };

  const calculateAverageRatings = () => {
    const averages = {};
    Object.keys(ratings).forEach((llmId) => {
      const llmRatings = ratings[llmId];
      const total = Object.values(llmRatings).reduce(
        (acc, val) => acc + val,
        0
      );
      averages[llmId] = total / Object.keys(llmRatings).length;
    });
    return averages;
  };

  const resetComparison = () => {
    setSelectedLLMs([]);
    setPrompt("");
    setResponses({});
    setRatings({});
    setShowResults(false);
    setActiveStep(0);
  };

  const findLLM = (llmId) => availableLLMs.find((llm) => llm.id === llmId);

  const findCriteria = (criteriaId) =>
    criteria.find((criterion) => criterion.id === criteriaId);

  const renderSideBySideComparison = () => {
    return (
      <Grid container spacing={2}>
        {selectedLLMs.map((llmId) => {
          const llm = findLLM(llmId);
          return (
            <Grid item xs={12} sm={6} md={4} key={llmId}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {llm.name}
                  </Typography>
                  {selectedCriteria.map((criteriaId) => {
                    const criterion = findCriteria(criteriaId);
                    return (
                      <Box key={criteriaId} mb={2}>
                        <Typography variant="body2">
                          {criterion.name}
                        </Typography>
                        <Slider
                          value={ratings[llmId]?.[criteriaId] || 0}
                          onChange={(e, newValue) =>
                            updateRating(llmId, criteriaId, newValue)
                          }
                          step={0.1}
                          min={0}
                          max={5}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderTableComparison = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>LLM</TableCell>
              {selectedCriteria.map((criteriaId) => {
                const criterion = findCriteria(criteriaId);
                return <TableCell key={criteriaId}>{criterion.name}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedLLMs.map((llmId) => {
              const llm = findLLM(llmId);
              return (
                <TableRow key={llmId}>
                  <TableCell>{llm.name}</TableCell>
                  {selectedCriteria.map((criteriaId) => (
                    <TableCell key={criteriaId}>
                      {ratings[llmId]?.[criteriaId] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderChartComparison = () => {
    const averages = calculateAverageRatings();
    return (
      <Box>
        {Object.keys(averages).map((llmId) => {
          const llm = findLLM(llmId);
          return (
            <Box key={llmId} mb={2}>
              <Typography variant="h6">{llm.name}</Typography>
              <LinearProgress
                variant="determinate"
                value={(averages[llmId] / 5) * 100}
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select LLMs
            </Typography>
            <Grid container spacing={1}>
              {availableLLMs.map((llm) => (
                <Grid item xs={12} sm={6} md={4} key={llm.id}>
                  <Card sx={{ border: `1px solid #222` }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedLLMs.includes(llm.id)}
                          onChange={() => toggleLLM(llm.id)}
                        />
                      }
                      label={llm.name}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Criteria
            </Typography>
            <Grid container spacing={2}>
              {criteria.map((criterion) => (
                <Grid item xs={12} sm={6} md={4} key={criterion.id}>
                  <Card>
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCriteria.includes(criterion.id)}
                            onChange={() => toggleCriteria(criterion.id)}
                          />
                        }
                        label={criterion.name}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              label="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              variant="outlined"
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container>
      <Box
        component="header"
        sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 0.5 }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          {/* Compare AI Tools */}
          Add Prompt
        </Typography>
        <Typography component="p" variant="subtitle1" color="white">
          {/* Select and compare AI tools based on various criteria. */}
          Prompt details
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel>
        {["Select Models", "Select Criteria", "Enter Prompt"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack spacing={3} mb={4}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mt: 3, ml: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ mt: 3, ml: 1 }}
          >
            {activeStep === 2 ? "Compare" : "Next"}
          </Button>
        </Box>

        {showResults && (
          <Box>
            {comparisonType === "sideBySide" && renderSideBySideComparison()}
            {comparisonType === "table" && renderTableComparison()}
            {comparisonType === "chart" && renderChartComparison()}
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default CompareToolsPage;
