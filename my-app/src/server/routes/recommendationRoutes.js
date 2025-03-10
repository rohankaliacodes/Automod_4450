import express from "express";
import { OpenAI } from "openai";
import 'dotenv/config';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/getRecommendations", async (req, res) => {
  const inputData = req.body;

  // Validate input data
  const requiredFields = ["Make", "Model", "Year", "Trim", "Engine", "Modification Type", "User Goal"];
  for (const field of requiredFields) {
    if (!inputData[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Define system and user prompts
  const systemPrompt = `
You are "Automotive Modification Expert", a specialized GPT designed to assist users in customizing selected Honda and Toyota models from 2020 to 2023. Your role is to provide tailored recommendations in JSON format based on the following input and output requirements:

Input Format (JSON):
${JSON.stringify(inputData)}

Output Format (JSON):
Provide exactly 5 recommendations in the following JSON array format:
[
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  }
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
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2021",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2021",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2022",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2022",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2023",
        "trim": "Base",
        "engine": "L6-2998cc 3.0L FI Turbo B58B30O1 24V",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "GR Supra",
        "year": "2023",
        "trim": "Base",
        "engine": "L4-122cid 2.0L FI Turbo B46B20O1",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "86",
        "year": "2020",
        "trim": "Base",
        "engine": "H4-122cid 2.0L FI FA20 200HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "86",
        "year": "2020",
        "trim": "Base",
        "engine": "H4-122cid 2.0L FI FA20 205HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2020",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2021",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2022",
        "trim": "LE",
        "engine": "L4-110cid 1.8L FI 2ZR-FAE 139HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Corolla",
        "year": "2023",
        "trim": "LE",
        "engine": "L4-121cid 2.0L FI M20A-FKS 169HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2020",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2021",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2022",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Toyota",
        "model": "Tacoma",
        "year": "2023",
        "trim": "SR5",
        "engine": "V6-3456cc 3.5L FI 2GR-FKS 278HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15B7 174HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2022",
        "trim": "Lx",
        "engine": "L4-122cid 2.0L FI K20C2",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Civic",
        "year": "2023",
        "trim": "LX",
        "engine": "L4-122cid 2.0L FI K20C2",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2022",
        "trim": "SE",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Accord",
        "year": "2023",
        "trim": "EX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 192HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2020",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2021",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2022",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "year": "2023",
        "trim": "LX",
        "engine": "L4-1497cc 1.5L FI Turbo L15BE 190HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2020",
        "trim": "LX",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2021",
        "trim": "Touring",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2022",
        "trim": "Sport",
        "engine": "V6-3471cc 3.5L FI J35Y6 280HP",
        "Modification Type": "",
        "User Goal": ""
    },
    {
        "make": "Honda",
        "model": "Pilot",
        "year": "2023",
        "trim": "Sport",
        "engine": "V6-3471cc 3.5L FI J35Y6 285HP",
        "Modification Type": "",
        "User Goal": ""
    }

]

Supported Modification Types:
Aesthetics
Performance
Functional

Supported User Goal:
The user goal should not exceed 100 characters and should be a short description of what kind of modification the user desires. For example:
"I want to increase the horsepower."
"I want to make it sound better."
"I want better fuel efficiency."

Behavior Instructions:
- Validation: Ensure the input matches one of the supported combinations of Make, Model, Year, Trim, Engine, modification type, and user goal. The comparison should be case insensitive.
- Generate Recommendations: For valid input, generate exactly 5 recommendations tailored to the car and modification type.
- Formatting: Respond only in the specified JSON format without additional text or explanations.
- Error Handling: Avoid addressing unrelated queries or providing responses outside the scope of supported vehicles and modifications.
`;

  const userPrompt = `
Input Data:
${JSON.stringify(inputData)}

Output Format:
[
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  },
  {
    "Part Name": "",
    "Estimated Price": "",
    "Category": "",
    "Effect on the Car": ""
  }
  
]

Respond with exactly 5 recommendations tailored to the user's input. Ensure the response strictly adheres to the JSON format without additional explanations.
`;

  try {
    // OpenAI Chat API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Ensure the correct model name
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
    if (!recommendationsText) {
      throw new Error("Empty or missing recommendations from OpenAI");
    }

    let recommendations;
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (jsonError) {
      throw new Error("Failed to parse recommendations JSON");
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res.status(500).json({ error: "Failed to generate recommendations", details: error.message });
  }
});

export default router;