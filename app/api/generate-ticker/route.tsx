import { NextResponse } from "next/server";

const RED_PILL_API_URL = "https://api.red-pill.ai/v1/chat/completions";
const API_KEY = process.env.RED_PILL_API_KEY;

export async function POST(request: Request) {
  try {
    const { words } = await request.json();

    if (!words || (!Array.isArray(words) && typeof words !== "string")) {
      return NextResponse.json(
        { success: false, error: "Invalid input. Provide an array or a string of words." },
        { status: 400 }
      );
    }

    const wordArray = typeof words === "string" ? words.split(",").map(w => w.trim()) : words;

    if (wordArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "The input must contain at least one word." },
        { status: 400 }
      );
    }

    const prompt = `
      You are a creative assistant specializing in generating unique names and tickers. Based on the following words: ${wordArray.join(
            ", "
          )}, generate a unique name and a ticker. The name should be a blend of these words and even synonyms or something conceptually linked. The ticker must be a maximum of 5 uppercase letters. Return the result in valid JSON format without backticks or additional characters:
      {
        "name": "Generated Name",
        "ticker": "TICKER"
      }`;

    const payload = {
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    };

    const response = await fetch(RED_PILL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Red Pill API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch from Red Pill API" },
        { status: response.status }
      );
    }

    const apiResponse = await response.json();
    let content = apiResponse.choices?.[0]?.message?.content;

    // Sanitize the AI response
    if (content) {
      content = content.replace(/```json|```/g, '').trim();
    }

    try {
      const parsedResponse = JSON.parse(content);

      if (!parsedResponse.name || !parsedResponse.ticker) {
        throw new Error("Invalid AI response format.");
      }

      return NextResponse.json({ success: true, data: parsedResponse });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}
