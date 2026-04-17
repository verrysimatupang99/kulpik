// Puter.js utility functions for KulPik
// Docs: https://docs.puter.com

declare global {
  interface Window {
    puter: any;
  }
}

// Check if Puter is loaded
export function isPuterLoaded(): boolean {
  return typeof window !== "undefined" && typeof window.puter !== "undefined";
}

// Wait for Puter to load
export async function waitForPuter(timeout: number = 10000): Promise<boolean> {
  if (isPuterLoaded()) return true;

  return new Promise((resolve) => {
    const startTime = Date.now();
    const check = setInterval(() => {
      if (isPuterLoaded()) {
        clearInterval(check);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(check);
        resolve(false);
      }
    }, 100);
  });
}

// Chat with AI using Puter
export async function chatWithPuter(
  prompt: string,
  model: string = "gpt-5-nano"
): Promise<string> {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  const response = await puter.ai.chat(prompt, {
    model: model,
    stream: false,
  });

  // Handle different response formats
  if (typeof response === "string") return response;
  if (response?.message?.content) return response.message.content;
  if (response?.text) return response.text;
  return JSON.stringify(response);
}

// Stream chat response
export async function* streamChatPuter(
  prompt: string,
  model: string = "gpt-5-nano"
): AsyncGenerator<string, void, unknown> {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  const response = await puter.ai.chat(prompt, {
    model: model,
    stream: true,
  });

  for await (const chunk of response) {
    if (typeof chunk === "string") {
      yield chunk;
    } else if (chunk?.message?.content) {
      yield chunk.message.content;
    } else if (chunk?.text) {
      yield chunk.text;
    }
  }
}

// List available models
export async function listModels(provider?: string) {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  return await puter.ai.listModels(provider);
}

// List available providers
export async function listModelProviders() {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  return await puter.ai.listModelProviders();
}

// Sign in to Puter
export async function signInPuter() {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  return await puter.auth.signIn();
}

// Sign out from Puter
export async function signOutPuter() {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  return await puter.auth.signOut();
}

// Check if signed in
export async function isSignedInPuter(): Promise<boolean> {
  if (!isPuterLoaded()) {
    return false;
  }

  try {
    const puter = window.puter;
    return await puter.auth.isSignedIn();
  } catch {
    return false;
  }
}

// Get current user
export async function getUserPuter() {
  if (!isPuterLoaded()) {
    throw new Error("Puter.js not loaded");
  }

  const puter = window.puter;
  return await puter.auth.getUser();
}

// Available models for KulPik
export const RECOMMENDED_MODELS = [
  { id: "gpt-5-nano", name: "GPT-5 Nano (Default)", provider: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "claude" },
  { id: "claude-haiku", name: "Claude Haiku", provider: "claude" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "google" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "deepseek" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "deepseek" },
  { id: "grok-3-mini", name: "Grok 3 Mini", provider: "xai" },
];
