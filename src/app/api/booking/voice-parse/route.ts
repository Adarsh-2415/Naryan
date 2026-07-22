import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { step, transcript, language } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const rawApiKey = process.env.GEMINI_API_KEY;

    // Fallback parser if API key is not present yet
    if (!rawApiKey) {
      const fallbackValue = fallbackLocalParser(step, transcript);
      return NextResponse.json({ cleanValue: fallbackValue, source: "fallback" });
    }

    // Clean up key if it contains quotes or trailing whitespace
    const cleanApiKey = rawApiKey.trim().replace(/^["']|["']$/g, "");

    // System prompt for Gemini AI
    const systemPrompt = `You are a clinical AI entity extractor for an appointment booking form.
Target field step: "${step}"
Language context: "${language}"
User spoken transcript: "${transcript}"

Task: Extract and format the clean field value accurately according to these rules:
- CRITICAL: All extracted values MUST be returned in standard English characters (Latin script) only.
- Never return Devanagari or Hindi characters (like 'आदर्श', 'कुमार', 'शर्मा') in the cleanValue output.
- If the user speaks or the transcript contains Hindi script, translate or transliterate it to standard English alphabets (e.g. "आदर्श" to "Adarsh", "राहुल शर्मा" to "Rahul Sharma", "सिविल लाइन्स" to "Civil Lines").
- If step is "name": Extract clean full name, capitalized in English. Remove conversational prefixes like "mera naam hai", "my name is", "naam hai", "I am".
- If step is "phone": Extract 10 digits only. Convert spoken number words to digits.
- If step is "email": Format into a valid email address using English characters. Convert spoken phrases like "at the rate", "at the rate of", "at rate", "at", "एट द रेट" to "@" AND "dot", "point", "डॉट" to ".". Remove ALL spaces and translate any Hindi characters to English equivalents (e.g., convert "आदर्शrke2004@gmail.com" to "adarshrke2004@gmail.com").
- If step is "address": Clean up address text formatting and write in English script.
- If step is "age": Extract numeric age as string.
- If step is "gender": Return strictly "Male", "Female", or "Other".

Respond ONLY with a raw JSON object containing one key: "cleanValue". No markdown code blocks, no extra text.
Example Input: "आदर्शrke2004@gmail.com"
Example JSON: {"cleanValue": "adarshrke2004@gmail.com"}`;

    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro"
    ];

    let response: Response | null = null;
    let activeModelUsed = "";

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanApiKey}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 100,
            },
          }),
        });

        if (res.ok) {
          response = res;
          activeModelUsed = model;
          break;
        } else {
          const errBody = await res.text();
          console.warn(`Gemini model ${model} response:`, res.status, errBody);
        }
      } catch (e) {
        console.warn(`Fetch error for model ${model}:`, e);
      }
    }

    if (!response || !response.ok) {
      const fallbackValue = fallbackLocalParser(step, transcript);
      return NextResponse.json({ cleanValue: fallbackValue, source: "fallback" });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedJsonText = rawText.replace(/```json|```/gi, "").trim();
    const jsonMatch = cleanedJsonText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.cleanValue) {
        return NextResponse.json({ cleanValue: String(parsed.cleanValue).trim(), source: `gemini (${activeModelUsed})` });
      }
    }

    const fallbackValue = fallbackLocalParser(step, transcript);
    return NextResponse.json({ cleanValue: fallbackValue, source: "fallback" });
  } catch (err: any) {
    console.error("Voice parse route error:", err);
    return NextResponse.json({ error: "Failed to parse voice transcript" }, { status: 500 });
  }
}

// Transliterates Devanagari (Hindi) script into Latin (English) characters
function transliterateDevanagari(text: string): string {
  const charMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', '्': '',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  let result = '';
  for (const char of text) {
    result += charMap[char] || char;
  }
  // Strip any remaining Devanagari characters or halant marks
  return result.replace(/[\u0900-\u097F]/g, '');
}

// Robust local entity parser
function fallbackLocalParser(step: string, input: string): string {
  const cleanInput = input.trim();
  switch (step) {
    case "name": {
      let extractedName = cleanInput
        .replace(/^(my name is|i am|im|mera naam hai|mera naam|naam hai|naam|this is|i'm|मेरा नाम है|मेरा नाम|नाम|मैं हूँ)\s+/i, "")
        .replace(/\s+(hai|है)$/i, "");
      const transliterated = transliterateDevanagari(extractedName);
      return transliterated.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    case "phone": {
      let text = cleanInput.toLowerCase();
      const numMap: Record<string, string> = {
        zero: "0", one: "1", two: "2", three: "3", four: "4",
        five: "5", six: "6", seven: "7", eight: "8", nine: "9",
        "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4",
        "पांच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9"
      };
      for (const [word, digit] of Object.entries(numMap)) {
        text = text.replace(new RegExp(`\\b${word}\\b`, "g"), digit);
      }
      const digits = text.replace(/\D/g, "");
      return digits.length >= 10 ? digits.slice(-10) : digits;
    }
    case "email": {
      let email = cleanInput
        .toLowerCase()
        .replace(/\s+(at the rate of|at the rate|at rate|at|एट द रेट)\s+/gi, "@")
        .replace(/\s+(dot|point|डॉट)\s+/gi, ".")
        .replace(/\s+/g, "");

      email = email
        .replace(/@gmailcom$/i, "@gmail.com")
        .replace(/@yahoocom$/i, "@yahoo.com")
        .replace(/@hotmailcom$/i, "@hotmail.com")
        .replace(/@outlookcom$/i, "@outlook.com");

      if (email.includes("@") && !email.includes(".", email.indexOf("@"))) {
        const parts = email.split("@");
        if (parts[1] && !parts[1].includes(".")) {
          email = `${parts[0]}@${parts[1]}.com`;
        }
      }
      return transliterateDevanagari(email);
    }
    case "address":
      return transliterateDevanagari(cleanInput);
    case "age": {
      let text = cleanInput.toLowerCase();
      const numMap: Record<string, string> = {
        twenty: "20", thirty: "30", forty: "40", fifty: "50",
        sixty: "60", seventy: "70", eighty: "80", ninety: "90"
      };
      for (const [word, digit] of Object.entries(numMap)) {
        text = text.replace(new RegExp(`\\b${word}\\b`, "g"), digit);
      }
      return text.replace(/\D/g, "");
    }
    case "gender": {
      const lower = cleanInput.toLowerCase();
      if (lower.includes("female") || lower.includes("woman") || lower.includes("girl") || lower.includes("महिला") || lower.includes("फीमेल")) return "Female";
      if (lower.includes("male") || lower.includes("man") || lower.includes("boy") || lower.includes("पुरुष") || lower.includes("मेल")) return "Male";
      return "Other";
    }
    default:
      return cleanInput;
  }
}
