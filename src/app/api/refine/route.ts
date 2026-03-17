import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 });
    }

    /* 
      TODO: Integrate your LLM of choice (OpenAI, Anthropic, etc.)
      Below is the prompt template you should send to the LLM:

      "Analyze the following user prompt and provide a structured JSON response. 
      The JSON must contain:
      1. 'analysis': A string explaining the potential issues or missing context in the original prompt.
      2. 'refinements': An object with exactly 5 keys:
         - 'expert': A technical, authoritative version.
         - 'creative': A version that uses metaphors and creative thinking.
         - 'logic': A step-by-step, highly structured version.
         - 'simple': A concise, easy-to-understand version.
         - 'detail': An exhaustive version covering all edge cases.

      User Prompt: ${prompt}"
    */

    // MOCK RESPONSE FOR DEMONSTRATION
    const mockResponse = {
      analysis: `The original prompt "${prompt.substring(0, 50)}..." is somewhat ambiguous and lacks specific constraints. It doesn't define the target audience or the desired tone clearly.`,
      refinements: {
        expert: `[Expert] Given the technical parameters of the request, please generate a high-performance solution that adheres to industry standards, incorporating ${prompt} while optimizing for scalability and maintainability.`,
        creative: `[Creative] Imagine a world where ${prompt} takes center stage. Paint a vivid picture and explore the unconventional possibilities that arise when these ideas collide in a new way.`,
        logic: `[Logic] Step 1: Define the core components of ${prompt}. Step 2: Establish the logical relationship between them. Step 3: Execute a systematic approach to achieve the objective with clear causality.`,
        simple: `[Simple] Please help me with ${prompt}. Keep it clear, short, and to the point.`,
        detail: `[Detail] Provide an exhaustive breakdown of ${prompt}. Include every possible variable, potential edge cases, specific formatting requirements, and a list of constraints to ensure a 100% accurate result.`,
      },
    };

    // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
