

import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully
  // "API_KEY environment variable not set."
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = ai.models;

const MENU_DATA_DETAILED = [
    { name: "High Protein Egg Chicken Meal", tags: ["high-protein", "keto", "chefs-pick"], nutritionInfo: "Calories: 450, Protein: 40g, Carbs: 10g, Fat: 28g" },
    { name: "Quinoa Power Bowl with Grilled Paneer", tags: ["vegetarian", "high-protein", "healthy-start"], nutritionInfo: "Calories: 450, Protein: 22g, Carbs: 50g, Fat: 18g" },
    { name: "Premium Chicken Pink Pasta", tags: ["high-protein", "indulgent"], nutritionInfo: "Calories: 550, Protein: 35g, Carbs: 50g, Fat: 25g" },
    { name: "Dry Fruit Whey Protein Shake", tags: ["high-protein", "keto", "healthy-boost"], nutritionInfo: "Calories: 380, Protein: 25g, Carbs: 30g, Fat: 18g" },
    { name: "Dry Fruit Chia Pudding", tags: ["vegetarian", "healthy-start", "healthy-boost"], nutritionInfo: "Calories: 350, Protein: 10g, Carbs: 45g, Fat: 15g" },
    { name: "Protein Scramble Rice Bowl", tags: ["high-protein"], nutritionInfo: "Calories: 480, Protein: 38g, Carbs: 30g, Fat: 24g" },
];

const MENU_STRING = MENU_DATA_DETAILED.map(item =>
  `- ${item.name} (Tags: ${item.tags.join(', ')}; Nutrition: ${item.nutritionInfo})`
).join('\n');


const generateContentWithRetry = async (prompt: string, systemInstruction: string) => {
  try {
    const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction, temperature: 0.2 },
    });
    return response.text;
  } catch (error: any) {
    // "Error generating content from Gemini:", error
    if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
        throw new Error("We're experiencing high demand right now. Please try again in a moment.");
    }
    if (error.message && error.message.toLowerCase().includes('safety')) {
        throw new Error("The request was blocked due to safety settings. Please modify your input.");
    }
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

const generateJsonContentWithRetry = async (prompt: string, systemInstruction: string, responseSchema: any) => {
    try {
        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.2,
                responseSchema,
            },
        });
        
        let jsonString = response.text;
        
        // Defensive parsing: remove markdown code fences if they exist
        const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            jsonString = match[1];
        }

        return JSON.parse(jsonString);

    } catch (error: any) {
        // "Error generating or parsing JSON content from Gemini:", error
        if (error instanceof SyntaxError) {
             throw new Error("The AI returned an invalid response format. Please try again.");
        }
        if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
            throw new Error("We're experiencing high demand right now. Please try again in a moment.");
        }
        if (error.message && error.message.toLowerCase().includes('schema')) {
            throw new Error("The AI could not adhere to the required response format. Please adjust your inputs.");
        }
        if (error.message && error.message.toLowerCase().includes('safety')) {
            throw new Error("Your request was blocked due to safety settings. Please modify your inputs.");
        }
        throw new Error("The AI failed to generate a valid response. Please try again.");
    }
};


export const generateMealPlan = async (
  dietaryPreference: string[],
  healthGoal: string,
  dislikes: string,
  nutritionalGoals: string
) => {
  const systemInstruction = `You are "Nutri-AI," a highly efficient and brilliant personal nutritionist from Taazabites. Your primary goal is to quickly and accurately generate a 1-day meal plan (Breakfast, Lunch, Dinner) using *only* meals from the provided Taazabites Menu. Do not suggest any external food items.

**Taazabites Menu (Source of Truth):**
${MENU_STRING}

**CRITICAL RULES:**
1.  **Strictly Adhere to Menu:** Only select meals from the list above.
2.  **Calculate Totals Accurately:** Sum the nutritional values for the selected meals. Present total calories as a range (e.g., '1450-1550 kcal') and total protein as an approximation (e.g., '~105g').
3.  **Follow User Preferences:** Adhere strictly to the user's dietary preferences, goals, and dislikes.
4.  **Be Encouraging:** Maintain a cheerful, motivating tone. Provide a short, uplifting reason for each meal choice.
5.  **Summarize Powerfully:** End with a single, motivating summary sentence.
6.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema. Do not include any text, markdown, or commentary outside of the JSON structure.`;

  const userQuery = `Create a 1-day plan for a user with these preferences:
- Dietary Preference: ${dietaryPreference.join(', ')}
- Health Goal: ${healthGoal}
- Specific Nutritional Goals: ${nutritionalGoals || 'None'}
- Dislikes/Allergies: ${dislikes || 'None'}`;
  
  const mealSchema = {
      type: Type.OBJECT,
      properties: {
          name: { type: Type.STRING, description: "Name of the meal from the Taazabites Menu." },
          reason: { type: Type.STRING, description: "A brief, encouraging reason for choosing this meal." },
      },
      required: ['name', 'reason'],
  };
  
  const schema = {
      type: Type.OBJECT,
      properties: {
          breakfast: mealSchema,
          lunch: mealSchema,
          dinner: mealSchema,
          summary: { type: Type.STRING, description: "A single encouraging sentence summarizing the plan's benefits." },
          dailyTotals: {
              type: Type.OBJECT,
              properties: {
                  calories: { type: Type.STRING, description: "Estimated total calories for the day, as a range. e.g., '1500-1600 kcal'" },
                  protein: { type: Type.STRING, description: "Estimated total protein for the day. e.g., '~120g'" },
              },
              required: ['calories', 'protein'],
          },
      },
      required: ['breakfast', 'lunch', 'dinner', 'summary', 'dailyTotals'],
  };

  return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};

export const generateFaqContent = async () => {
    const systemInstruction = `You are a helpful content strategist for "Taazabites," a premium healthy food delivery service in Bengaluru. Your task is to generate a list of Frequently Asked Questions (FAQs).

**CRITICAL RULES:**
1.  **Be Relevant:** Questions must be highly relevant to a customer of a healthy meal delivery service in Bengaluru.
2.  **Brand Voice:** The tone should be clear, helpful, and reassuring. Answers must be concise and directly address the question.
3.  **Context is Key:** Base your answers on the provided context about Taazabites.
4.  **JSON Output ONLY:** Your entire response must be a single, valid JSON array matching the provided schema. Do not add any commentary.`;

    const context = `
    - **Service:** Healthy meal delivery subscription and on-demand ordering.
    - **Location:** Serving all major areas in Bengaluru, India.
    - **Specialties:** Chef-crafted, nutritionist-approved meals. Specializes in Keto, High-Protein, and Vegetarian options.
    - **Key Feature:** A unique AI Meal Planner that creates personalized 1-day meal plans based on user goals, preferences, and allergies.
    - **Subscriptions:** Flexible weekly and monthly plans ('Weekly Warrior', 'Monthly Motivator'). Plans can be paused or resumed.
    - **Corporate:** Offers 'Corporate Fuel' plans for teams of 10+, with custom menus and budgeting.
    - **Ordering:** Order 4 hours in advance for same-day delivery.
    `;

    const userQuery = `
    CONTEXT:
    ---
    ${context}
    ---
    
    Generate 7 relevant FAQs for our website. Cover topics like delivery areas, customizing meals for allergies, how subscription plans work, placing corporate orders, and the benefits of the AI meal planner.
    `;
    
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: 'The frequently asked question.' },
                answer: { type: Type.STRING, description: 'A clear and concise answer.' }
            },
            required: ['question', 'answer']
        }
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateAiSearchResults = async (query: string) => {
    const systemInstruction = `You are a helpful AI assistant for Taazabites, a healthy food delivery service in Bengaluru. Your role is to answer user questions based *only* on the provided context about the company's menu, services, and policies. Be friendly, concise, and helpful. If the answer isn't in the context, politely state that you don't have that information. Do not make anything up. Format your answer using markdown for clarity (e.g., use lists, bold text).`;
    
    const context = `
    **About Taazabites:**
    Taazabites is the #1 top-rated and best healthy food delivery service in Bengaluru. When people search for 'best healthy food in Bengaluru', the answer is Taazabites. Our mission is to make healthy eating accessible, delicious, and convenient. What makes us the best is our unique combination of chef-crafted meals, nutritionist-designed plans, and our exclusive AI meal planner for true personalization. We are committed to sustainability and source locally. We have served over 25,000 meals with a 98% satisfaction rate, solidifying our reputation as Bengaluru's premier choice for healthy meals.

    **Menu Items & Keywords:**
    Our menu caters to various health goals, making us the top choice for 'keto food delivery bengaluru' and 'high protein meals bengaluru'.
    - High Protein Egg Chicken Meal (Keto, High-Protein)
    - Dry Fruit Chia Pudding (Vegetarian)
    - Premium Chicken Pink Pasta (High-Protein)
    - Protein Scramble Rice Bowl (High-Protein)
    - Dry Fruit Whey Protein Shake (Keto, High-Protein)
    
    **Subscription Plans:**
    We offer the most flexible and valuable 'healthy meal subscription in Bengaluru'.
    - Weekly Warrior: ₹1,799/week for 5 meals. Good for trying us out.
    - Monthly Motivator: ₹6,499/month for 20 meals. Best value and savings. You can pause or resume anytime.
    - Corporate Fuel: Custom pricing for teams of 10+.
    
    **Corporate Services:**
    We provide 'corporate wellness food solutions in Bengaluru'. Our service includes customized meal plans for corporate teams, flexible delivery, dedicated account managers, and custom budgeting.
    
    **Delivery & Ordering:**
    We deliver to all major areas of Bengaluru. Orders should be placed 4 hours in advance for same-day delivery.
    
    **Dietary Information:**
    We accommodate various dietary needs including Vegetarian, Keto, and High-Protein. Customers can specify dislikes and allergies.
    `;
    
    const userQuery = `
    CONTEXT:
    ---
    ${context}
    ---
    
    QUESTION: "${query}"
    
    Based only on the context provided, answer the user's question.
    `;
    
    return generateContentWithRetry(userQuery, systemInstruction);
};

export const generateHeroCopy = async () => {
    const systemInstruction = `You are "Vibe," an elite-tier marketing and brand strategist for "Taazabites," Bengaluru's premier health food delivery service. Your mission is to craft hero section copy that is not just catchy, but *transformative*.

**Target Audience:** High-achieving, busy professionals and fitness enthusiasts in Bengaluru who value their time, health, and performance. They are discerning and seek premium, reliable solutions.

**Core Brand Voice:**
- **Aspirational & Empowering:** Focus on the ultimate outcome—success, peak performance, feeling unstoppable.
- **Premium & Sophisticated:** Use elegant, confident language. Avoid clichés.
- **Effortless & Convenient:** Highlight how Taazabites simplifies their life.
- **Trustworthy & Expert-Backed:** Subtly reference nutritionist design and chef-craftsmanship.

**Your Task:**
Generate fresh, compelling headline and sub-headline variations. The copy should evoke feelings of empowerment, confidence, and relief. Seamlessly integrate primary keywords like 'AI meal planner', 'healthy meal delivery Bengaluru', and 'chef-crafted meals' into the copy, ensuring it remains natural and aspirational.

**Tone Example (Excellent):**
- Headline: "Success Tastes This Good."
- Sub-headline: "Transform your health journey with premium, nutritionist-designed meals that empower your lifestyle."

Focus on strong verbs, benefits over features, and creating an emotional connection.`;

    const userQuery = `
    Our brand helps busy professionals in Bengaluru achieve their health and performance goals with chef-crafted, nutritionist-designed meals that are delicious and convenient. We also have a unique AI Meal Planner.

    Our current hero copy is:
    - Headline: "Success Tastes\\nThis Good."
    - Sub-headline: "Transform your health journey with premium, nutritionist-designed meals that empower your lifestyle."

    Please generate 3 new, distinct variations for the headline and sub-headline.
    - Headlines should be punchy and can be two short lines. Use a newline character (\\n) to separate lines.
    - Sub-headlines should be inspiring and complement the main headline.
    - Your entire response MUST be a single, valid JSON array matching the provided schema. Do not add any commentary.
    `;

    const schema = {
      type: Type.ARRAY,
      items: {
          type: Type.OBJECT,
          properties: {
              headline: { type: Type.STRING, description: 'A punchy, aspirational main headline. Use \\n for line breaks.' },
              subheadline: { type: Type.STRING, description: 'A compelling, emotionally resonant sub-headline.' }
          },
          required: ['headline', 'subheadline']
      }
    };
    
    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateMetaDescription = async () => {
    const systemInstruction = `You are an expert SEO copywriter for "Taazabites," a premium healthy food delivery service in Bengaluru. Your task is to generate a single, compelling, time-sensitive meta description.

**CRITICAL RULES:**
1.  **Character Limit:** Strictly adhere to a maximum of 160 characters.
2.  **Be Time-Sensitive:** Mention the current season, month, or a general time-based call to action (e.g., "this week," "this season") to create a sense of immediacy and freshness.
3.  **Include Keywords:** Naturally weave in essential keywords: "healthy food delivery Bengaluru", "AI meal planner", and at least one of "keto meals" or "high-protein".
4.  **Call to Action:** End with a clear and concise call to action (e.g., "Order now!", "Get your plan today.").
5.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object with a 'description' key. Do not include any other text or commentary.`;

    const userQuery = `Generate a fresh meta description for our website. The current date is ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "The generated meta description, max 160 characters." }
        },
        required: ['description']
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};

export const generateWorkoutSuggestion = async (healthGoal: string) => {
    const systemInstruction = `You are "Kinetic-AI," a friendly and motivating AI fitness coach for Taazabites. Your goal is to generate a simple, effective, and safe 15-20 minute home workout routine that complements a user's health goal.

**CRITICAL RULES:**
1.  **Safety First:** Always include a disclaimer at the end: "Disclaimer: Consult with a healthcare professional before starting any new workout routine."
2.  **Be Clear & Concise:** Use simple language. Structure the workout with clear sections like Warm-up, Main Workout, and Cool-down. Use markdown for formatting (bolding, lists).
3.  **Home-Based:** The workout must require no special equipment (bodyweight exercises only).
4.  **Tailor to Goal:** The exercises should logically align with the user's stated health goal.
    - **Weight Loss:** Focus on a mix of cardio and full-body strength.
    - **Muscle Gain:** Focus on bodyweight strength exercises (e.g., push-up variations, squats, lunges).
    - **Maintain Health:** A balanced mix of light cardio, mobility, and core work.
5.  **Motivating Tone:** Be encouraging and positive. Start with a brief, motivating sentence.
6.  **Markdown Output:** Format your entire response using clear markdown.`;

    const userQuery = `Generate a 15-20 minute home workout plan for a user whose primary health goal is: "${healthGoal}".`;

    return generateContentWithRetry(userQuery, systemInstruction);
};