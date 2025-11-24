// Direct API call to avoid external SDK scripts (CSP friendly)
export const analyzeJobWithGemini = async (apiKey, resume, jd) => {
    // Using gemini-2.5-flash as per latest guidelines. 
    // If this specific version is not yet available in your region, try 'gemini-2.0-flash-exp' or 'gemini-1.5-flash-latest'.
    const MODEL_NAME = 'gemini-2.5-flash';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
  
    const promptText = `
      You are an expert ATS (Applicant Tracking System) and Career Coach.
      
      Task: Compare the Candidate Resume with the Job Description.
      
      Candidate Resume:
      ${resume}
      
      Job Description:
      ${jd}
      
      Analyze the fit and return a JSON object (NO Markdown formatting, just raw JSON) with:
      1. "score": A number from 0 to 100 indicating the match percentage.
      2. "summary": A concise 1-sentence summary of the candidate's fit.
      3. "missing_keywords": An array of important hard skills or keywords found in the JD but missing in the Resume.
      4. "tailoring_advice": An array of 3 specific, actionable bullet points on how to tailor the resume for this specific job.
    `;
  
    const payload = {
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Return a cleaner error message
        const errorMessage = errorData.error?.message || `API Status: ${response.status}`;
        throw new Error(`Gemini API Error: ${errorMessage}`);
      }
  
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error("The AI returned an empty response. Please try again.");
      }
  
      try {
        return JSON.parse(textResponse);
      } catch (jsonError) {
        console.error("JSON Parse Error", textResponse);
        throw new Error("AI response was not valid JSON.");
      }
  
    } catch (error) {
      console.error("Full Error Details:", error);
      throw error; // Re-throw to be caught by popup.js
    }
  };