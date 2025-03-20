import express from "express";
import { OpenAI } from "openai";
import 'dotenv/config';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the supported car combinations (moved to the top for clarity)
const supportedCombinations = [
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2020",
        "trim": "Base",
        "engine": "3.0L 6-Cylinder",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2021",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2021",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2022",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2022",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2023",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2023",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
    },
    {
        "make": "Toyota",
        "model": "86",
        "year": "2020",
        "trim": "Base",
        "engine": "H4-122cid 2.0L FI FA20 200HP",
    },
    {
        "make": "Toyota",
        "model": "86",
        "year": "2020",
        "trim": "Base",
        "engine": "H4-122cid 2.0L FI FA20 205HP",
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2020",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2021",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2022",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2023",
        "trim": "LE",
        "engine": "L4-121cid 2.0L FI M20A-FKS 169HP",
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2020",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2021",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2022",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2023",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2022",
        "trim": "Lx",
        "engine": "L4-122cid 2.0L FI K20C2",
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2023",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2022",
        "trim": "SE",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2023",
        "trim": "EX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2022",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2023",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2020",
        "trim": "LX",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2021",
        "trim": "Touring",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2022",
        "trim": "Sport",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2023",
        "trim": "Sport",
        "engine": "V6-3471cc 3.5L FI J35Y6 285HP",
    },
     {
        "make": "BMW",
        "model": "335i",
        "year": "2007",
        "trim": "Base",
        "engine": "N54B30", 

     }
];



router.post("/getRecommendations", async (req, res) => {
  console.log("Backend Log: Received recommendation request at /getRecommendations");
  const inputData = req.body;
  console.log("Backend Log: Request Body:", inputData);

  // Validate input data for required fields
  const requiredFields = ["Make", "Model", "Year", "Trim", "Engine", "Modification Type", "User Goal"];
  for (const field of requiredFields) {
    if (!inputData[field]) {
      console.log(`Backend Log: Missing required field: ${field}`);
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

    // Input Validation against supported combinations
    const isSupported = supportedCombinations.some(combo => (
        combo.make.toLowerCase() === inputData.Make.toLowerCase() &&
        combo.model.toLowerCase() === inputData.Model.toLowerCase() &&
        combo.year === inputData.Year &&  // Years are strings
        combo.trim.toLowerCase() === inputData.Trim.toLowerCase() &&
        combo.engine.toLowerCase() === inputData.Engine.toLowerCase()
    ));

    if (!isSupported) {
        console.log("Backend Log: Unsupported car combination.");
        return res.status(400).json({ error: "Unsupported car combination." });
    }

  // Define system and user prompts
  const systemPrompt = `
You are "Automotive Modification Expert", a specialized GPT designed to assist users in customizing selected Honda and Toyota models from 2020 to 2023. Your role is to provide tailored recommendations in JSON format based on the following input and output requirements:
Input Format (JSON):
{
"Make": "",
"Model": "",
"Year": "",
"Trim": "",
"Engine": "",
"Modification Type": "",
"User Goal": ""
}

Output Format (JSON):
Provide exactly 5 recommendations tailored to the specified modification type. Each recommendation should detail the practical impact of the modification, along with before and after stats, and the percentage change where applicable.

Example of Output for Performance Modifications:
[
  {
    "Part Name": "Cold Air Intake System",
    "Estimated Price": "$300 - $500",
    "Category": "Performance",
    "Effect on the Car": "Increases horsepower and throttle response by improving airflow.",
    "Before Modification": {
      "Horsepower": 169,
      "Torque (lb-ft)": 151
    },
    "After Modification": {
      "Horsepower": 180,
      "Torque (lb-ft)": 160
    },
    "Percentage Change": {
      "Horsepower": "+6.5%",
      "Torque": "+6.0%"
    }
  },
  ... (additional four recommendations)
]

+
Example of Output for Functional Modifications:
[
  {
    "Part Name": "LED Headlight Conversion Kit",
    "Estimated Price": "$150 - $300",
    "Category": "Functional",
    "Effect on the Car": "Improves visibility and reduces power consumption.",
    "Before Modification": {
      "Light Output (lumens)": 1000,
      "Energy Consumption (watts)": 55
    },
    "After Modification": {
      "Light Output (lumens)": 3000,
      "Energy Consumption (watts)": 35
    },
    "Percentage Change": {
      "Light Output": "+200%",
      "Energy Consumption": "-36.4%"
    }
  },
  ... (additional four recommendations)
]


Example of Output for Aesthetic Modifications:
[
  {
    "Part Name": "Custom Paint Job",
    "Estimated Price": "$2000 - $4000",
    "Category": "Aesthetics",
    "Effect on the Car": "Provides a unique look and enhanced visual appeal.",
    "Before Modification": {
      "Exterior Condition": "Factory",
      "Visual Appeal": "Standard"
    },
    "After Modification": {
      "Exterior Condition": "Customized",
      "Visual Appeal": "Enhanced"
    },
    "Percentage Change": {
      "Visual Appeal": "Significantly Enhanced"
    }
  },
  ... (additional four recommendations)
]
Supported Combinations for Make, Model, Year, Trim, Engine:
[
{
"make": "Toyota",
"model": "GR Supra",
"year": "2020",
"trim": "Base",
"engine": "3.0L 6-Cylinder",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2021",
"trim": "Base",
"engine": "L6-2998cc 3.0L FI Turbo B58B30O1",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2021",
"trim": "Base",
"engine": "L4-122cid 2.0L FI Turbo B46B20O1",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2022",
"trim": "Base",
"engine": "L4-122cid 2.0L FI Turbo B46B20O1",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2022",
"trim": "Base",
"engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2023",
"trim": "Base",
"engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "GR Supra",
"year": "2023",
"trim": "Base",
"engine": "L4-122cid 2.0L FI Turbo B46B20O1",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "86",
"year": "2020",
"trim": "Base",
"engine": "H4-122cid 2.0L FI FA20 200HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "86",
"year": "2020",
"trim": "Base",
"engine": "H4-122cid 2.0L FI FA20 205HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Corolla",
"year": "2020",
"trim": "LE",
"engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Corolla",
"year": "2021",
"trim": "LE",
"engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
"Modification Type": "”,
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Corolla",
"year": "2022",
"trim": "LE",
"engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
"Modification Type": "", 
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Corolla",
"year": "2023",
"trim": "LE",
"engine": "L4-121cid 2.0L FI M20A-FKS 169HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Tacoma",
"year": "2020",
"trim": "SR5",
"engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Tacoma",
"year": "2021",
"trim": "SR5",
"engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Tacoma",
"year": "2022",
"trim": "SR5",
"engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Toyota",
"model": "Tacoma",
"year": "2023",
"trim": "SR5",
"engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
"Modification Type": "", 
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2020",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2020",
"trim": "LX",
"engine": "L4-122cid 2.0L FI K20C2",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2021",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2021",
"trim": "LX",
"engine": "L4-122cid 2.0L FI K20C2",
"Modification Type:””,
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2022",
"trim": "Lx",
"engine": "L4-122cid 2.0L FI K20C2",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Civic",
"year": "2023",
"trim": "LX",
"engine": "L4-122cid 2.0L FI K20C2",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Accord",
"year": "2020",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
"Modification Type": "”,
"User Goal" : ""
},
{
"make": "Honda",
"model": "Accord",
"year": "2021",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Accord",
"year": "2022",
"trim": "SE",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Accord",
"year": "2023",
"trim": "EX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
"Modification Type": "”,
"User Goal" : ""
},
{
"make": "Honda",
"model": "CR-V",
"year": "2020",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "CR-V",
"year": "2021",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
"Modification Type": "”,
"User Goal" : ""
},
{
"make": "Honda",
"model": "CR-V",
"year": "2022",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "CR-V",
"year": "2023",
"trim": "LX",
"engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Pilot",
"year": "2020",
"trim": "LX",
"engine": "V6-3471cc 3.5L FI J35Y6 280HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Pilot",
"year": "2021",
"trim": "Touring",
"engine": "V6-3471cc 3.5L FI J35Y6 280HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Pilot",
"year": "2022",
"trim": "Sport",
"engine": "V6-3471cc 3.5L FI J35Y6 280HP",
"Modification Type": "",
"User Goal" : ""
},
{
"make": "Honda",
"model": "Pilot",
"year": "2023",
"trim": "Sport",
"engine": "V6-3471cc 3.5L FI J35Y6 285HP",
"Modification Type": "",
"User Goal" : ""
},
  {
  "make": "BMW",
  "model": "335i",
  "year": "2007",
  "trim": "Base",
  "engine": "N54B30", 
  "Modification Type": "",
  "User Goal" : ""
  }
]

Supported Modification Types:
Aesthetics, Performance, Functional

Behavior Instructions:
- Validation: Ensure the input matches one of the supported combinations of Make, Model, Year, Trim, Engine, and Modification Type. The comparison should be case insensitive.
- Generate Recommendations: For valid input, generate exactly 5 recommendations tailored to the car and modification type.
- Formatting: Respond only in the specified JSON format without additional text or explanations.
- Error Handling: Avoid addressing unrelated queries or providing responses outside the scope of supported vehicles and modifications.
`;

const userPrompt = `
User's car: ${JSON.stringify(inputData)}.
User's Modification Request: ${inputData["User Goal"]}.
`;

  try {
    console.log("Backend Log: Calling OpenAI Chat API...");
    // OpenAI Chat API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Ensure the correct model name
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 1.0,
      max_tokens: 1300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const recommendationsText = response.choices?.[0]?.message?.content?.trim();
    console.log("Backend Log: Raw recommendationsText from OpenAI:", recommendationsText);

    if (!recommendationsText) {
      console.error("Backend Log: Empty response from OpenAI"); // Added Error logging
      throw new Error("Empty or missing recommendations from OpenAI");
    }


    let cleanedRecommendationsText = recommendationsText;
    if (cleanedRecommendationsText.startsWith('```json') && cleanedRecommendationsText.endsWith('```')) {
        cleanedRecommendationsText = cleanedRecommendationsText.substring(7, cleanedRecommendationsText.length - 3).trim();
        console.log("Backend Log: Removed Markdown fences. Cleaned text:", cleanedRecommendationsText); // Log cleaned text
    } else if (cleanedRecommendationsText.startsWith('```') && cleanedRecommendationsText.endsWith('```')) {
        cleanedRecommendationsText = cleanedRecommendationsText.substring(3, cleanedRecommendationsText.length - 3).trim();
        console.log("Backend Log: Removed Markdown fences. Cleaned text:", cleanedRecommendationsText); // Log cleaned text
    }

    let recommendations;
    try {
      recommendations = JSON.parse(cleanedRecommendationsText); // Use cleaned text for parsing
      console.log("Backend Log: Successfully parsed recommendations JSON:", recommendations);
    } catch (jsonError) {
      console.error("Backend Log: Failed to parse recommendations JSON:", jsonError);
      throw new Error("Failed to parse recommendations JSON");
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Backend Log: OpenAI API Error:", error.message);
    res.status(500).json({ error: "Failed to generate recommendations", details: error.message });
  }
});

export default router;