import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT_TEMPLATES = {
  hero: "Aerial view of modern Gujarat industrial estate, clean organized factory buildings, professional photography, golden hour light, no text, 16:9 aspect ratio, photorealistic",
  textiles:
    "Colorful premium fabric rolls stacked in organized Indian textile warehouse, Surat manufacturing, vibrant colors, professional product photography, clean composition, warm lighting, no text",
  diamonds:
    "Brilliant cut diamonds and precious gems in professional jewelry photography lighting, Surat Gujarat gem cutting industry, luxury product photography, black background, cinematic, no text",
  metals:
    "Precision engineered steel components and industrial parts on clean surface, Indian manufacturing quality, professional product photography, Rajkot engineering industry, no text",
  chemicals:
    "Modern chemical laboratory and industrial facility, organized storage, safety equipment visible, clean professional environment, Gujarat India, no text",
  pharmaceuticals:
    "Clean room pharmaceutical manufacturing facility, modern equipment, workers in protective gear, organized professional environment, India, no text",
  placeholder:
    "Modern Indian manufacturing facility exterior, clean professional building facade, organized grounds, professional business photography, neutral warm tones, no text",
};

// Simple in-memory rate limiter (use Upstash Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = requestCounts.get(ip);

  if (!window || now > window.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (window.count >= 10) return false;
  window.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { type, prompt: customPrompt } = await req.json();

    const prompt =
      customPrompt ||
      PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES] ||
      PROMPT_TEMPLATES.placeholder;

    // Check if already cached in Supabase Storage
    const supabase = await createAdminClient();
    const cacheKey = `generated/${Buffer.from(prompt).toString("base64").slice(0, 40)}.jpg`;

    const { data: existingFile } = await supabase.storage
      .from("generated-images")
      .list("generated", {
        search: cacheKey.replace("generated/", ""),
      });

    if (existingFile && existingFile.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from("generated-images")
        .getPublicUrl(cacheKey);
      return NextResponse.json({ url: publicUrl, cached: true });
    }

    // Generate with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "text/plain",
          data: Buffer.from(
            `Generate a photorealistic image: ${prompt}`
          ).toString("base64"),
        },
      },
    ]);

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");

    // Save to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("generated-images")
      .upload(cacheKey, imageBuffer, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("generated-images")
      .getPublicUrl(cacheKey);

    return NextResponse.json({ url: publicUrl, cached: false });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
