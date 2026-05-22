import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function getOpenAI() {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  if (!apiKey) throw new Error("No OpenAI API key configured. Set OPENAI_API_KEY in Replit Secrets.");
  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

const NOOSFERA_THEMES = [
  "a majestic dragon soaring through storm clouds with lightning",
  "an epic medieval battle with knights and sorcerers on horseback",
  "a futuristic spaceship emerging from a glowing nebula in deep space",
  "an enchanted ancient forest with glowing magical creatures and fireflies",
  "a massive sailing ship on stormy seas at sunset with dramatic waves",
  "a pack of wolves running through a snow-covered pine forest at dusk",
  "a phoenix rising from golden flames in a mystical landscape",
  "an underwater ancient city with bioluminescent sea creatures",
  "a warrior mage casting brilliant spells in an ancient stone temple",
  "a pride of lions in an African savanna at golden hour",
  "a crystal cave with mythical creatures and glowing gems",
  "a fierce battle between fire dragons and ice griffins in the sky",
  "a mystical forest with fairies and ancient tree spirits at night",
  "a family of elephants in a lush green jungle landscape",
  "space explorers discovering an alien world with towering crystal formations",
  "a giant sea serpent emerging from stormy ocean depths near a lighthouse",
  "an armada of pirate ships in an epic naval battle at night",
  "a fierce tiger stalking through dense tropical jungle foliage",
  "a medieval castle on a cliff surrounded by a magical aurora",
  "a cyberpunk city at night with neon lights and flying vehicles",
  "a herd of wild horses galloping across an open plain at sunrise",
  "an ancient temple guarded by stone golems in a jungle",
  "a polar bear and her cubs on an ice floe under northern lights",
  "a vast fantasy battlefield with armies of elves and dark knights",
  "a deep space station orbiting a ringed gas giant planet",
]

const STYLE_DESCRIPTORS: Record<string, string> = {
  abstract: "vibrant abstract digital art with bold colors and geometric shapes,",
  realistic: "ultra-photorealistic, cinematic photography style,",
  hyperrealistic: "hyper-detailed photorealistic with dramatic studio lighting,",
  surreal: "surrealist dream-like painting style with impossible landscapes,",
  minimalist: "minimalist clean artistic illustration,",
  organic: "organic flowing natural shapes, botanical art style,",
  geometric: "geometric low-poly polygon art style,",
  fractal: "fractal recursive mandelbrot art style, infinitely detailed,",
}

router.post("/generate-description", async (req, res) => {
  const { pulses, emotionalState, title } = req.body
  const avg = Math.round((pulses as number[]).reduce((a: number, b: number) => a + b, 0) / pulses.length)
  const range = Math.max(...pulses) - Math.min(...pulses)

  const intensity = avg > 100 ? "elevada tensión interna" : avg > 80 ? "energía moderada y consciente" : "calma profunda y meditativa"
  const variability = range > 30 ? "ritmo irregular que sugiere emociones en conflicto" : range > 15 ? "oscilación controlada entre estados" : "ritmo estable y centrado"

  const prompt = `Eres un analista de arte biométrico de nivel mundial. Completa la siguiente frase en español con 20-30 palabras que describan de forma precisa y profesional qué expresa visualmente esta obra y qué revela del estado interior de quien la creó: "La imagen generada representa ___". Datos clave: intensidad vital → ${intensity}; patrón de variabilidad → ${variability}; estilo visual → "${title}". El texto debe sonar como el catálogo de una galería de arte contemporáneo: concreto, evocador, sin clichés. No menciones BPM ni números. Responde SOLO con el texto que va después de "representa", sin comillas ni punto final.`

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
    })
    res.json({ description: response.choices[0]?.message?.content?.trim() || "" })
  } catch (err: any) {
    console.error("Description generation error:", err)
    res.status(500).json({ error: err.message })
  }
})

router.post("/generate-image", async (req, res) => {
  const { style, emotionalState, stressLevel, heartHealthScore } = req.body

  const seed = Math.floor(((stressLevel || 50) + (heartHealthScore || 75)) * 0.37 + Date.now() % 100)
  const theme = NOOSFERA_THEMES[seed % NOOSFERA_THEMES.length]

  const artisticStyle = STYLE_DESCRIPTORS[style] || "vibrant digital art,"
  const moodMap: Record<string, string> = {
    calm: "peaceful and serene atmosphere, soft lighting",
    normal: "epic and dramatic atmosphere, dynamic lighting",
    stressed: "intense and energetic atmosphere, bold contrast",
    alert: "powerful and awe-inspiring atmosphere, high energy",
  }
  const mood = moodMap[emotionalState] || "epic and dramatic atmosphere, dynamic lighting"

  const prompt = `${artisticStyle} ${theme}, ${mood}, highly detailed, professional digital art, 8k resolution, masterpiece quality, vivid saturated colors`

  try {
    const response = await getOpenAI().images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    })

    const b64 = response.data?.[0]?.b64_json
    if (b64) {
      res.json({ imageUrl: `data:image/png;base64,${b64}`, theme, prompt })
    } else {
      res.status(500).json({ error: "No image data returned" })
    }
  } catch (err: any) {
    console.error("OpenAI image generation error:", err)
    res.status(500).json({ error: err.message || "Failed to generate image" })
  }
})

const uploadsDir = path.resolve(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

router.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" })
    return
  }
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`
  const filepath = path.join(uploadsDir, filename)
  fs.writeFileSync(filepath, req.file.buffer)
  res.json({ url: `/api/uploads/${filename}` })
})

router.get("/uploads/:filename", (req, res) => {
  const filepath = path.join(uploadsDir, req.params.filename)
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "File not found" })
    return
  }
  res.sendFile(filepath)
})

export default router
