"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Volume2, VolumeX, Sparkles, Check, Globe } from "lucide-react";
import Image from "next/image";

interface VoiceAssistantProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isReturning: boolean;
  setIsReturning: React.Dispatch<React.SetStateAction<boolean>>;
  previousBookingRef: string;
  setPreviousBookingRef: React.Dispatch<React.SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleFetchPatientDetails: () => Promise<void>;
}

type DialogStep = "idle" | "name" | "phone" | "email" | "address" | "age" | "gender" | "complete";
type Language = "en" | "hi";

const PROMPTS = {
  en: {
    welcome: "Hello, welcome to Narayan Homoeopathic Chikitsalaya. I will help you fill the booking form. Please tell me your full name.",
    nameSuccess: (name: string) => `Great. Nice to meet you, ${name}. What is your 10-digit mobile number?`,
    invalidPhone: "Please speak a valid ten digit mobile number.",
    phoneSuccess: "Got it. What is your email address?",
    emailSuccess: "Got it. What is your address?",
    addressSuccess: "Got it. What is your age in years?",
    invalidAge: "Please speak a valid age in numbers.",
    ageSuccess: "Got it. What is your gender? Please say Male, Female, or Other.",
    completeMsg: "Thank you so much! Please review your details and pick your appointment date and time to finish your booking.",
    noSpeech: "Sorry, I didn't hear anything. Could you please repeat that?"
  },
  hi: {
    welcome: "नमस्ते! नारायण होम्योपैथिक चिकित्सालय में आपका स्वागत है। मैं बुकिंग फॉर्म भरने में आपकी मदद करूंगा। कृपया अपना पूरा नाम बताएं।",
    nameSuccess: (name: string) => `बहुत बढ़िया, ${name} जी। अब अपना 10 अंकों का मोबाइल नंबर बताएं।`,
    invalidPhone: "कृपया 10 अंकों का सही मोबाइल नंबर बोलें।",
    phoneSuccess: "धन्यवाद। अब अपना ईमेल पता बताएं।",
    emailSuccess: "धन्यवाद। अब अपना पता यानी एड्रेस बताएं।",
    addressSuccess: "धन्यवाद। आपकी उम्र यानी एज कितनी है?",
    invalidAge: "कृपया अपनी सही उम्र संख्याओं में बताएं।",
    ageSuccess: "धन्यवाद। आपका जेंडर क्या है? कृपया मेल, फीमेल या अदर कहें।",
    completeMsg: "बहुत-बहुत धन्यवाद! कृपया अपनी जानकारी चेक करें और अपना अपॉइंटमेंट बुक करने के लिए समय चुनें।",
    noSpeech: "माफ़ कीजिए, मुझे आपकी आवाज़ नहीं सुनाई दी। क्या आप दोबारा बोलेंगे?"
  }
};

export default function VoiceAssistant({
  formData,
  setFormData,
  isReturning,
  setIsReturning,
  previousBookingRef,
  setPreviousBookingRef,
  currentStep,
  setCurrentStep,
  handleFetchPatientDetails
}: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("idle");
  const [language, setLanguage] = useState<Language>("hi");
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const handleVoiceInputRef = useRef<any>(null);
  const speakAndListenRef = useRef<any>(null);

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-IN";

      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Update speech recognition language when state changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-IN";
    }
  }, [language]);

  // Start listening method
  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } catch (_) {}

    setTimeout(() => {
      try {
        setIsListening(true);
        setTranscript("");
        recognitionRef.current.start();
      } catch (e: any) {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      }
    }, 100);
  };

  // Stop listening method
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
  };

  // Speak a prompt and start listening after it ends
  const speakAndListen = (text: string, langTarget?: Language) => {
    const activeLang = langTarget || language;
    setAssistantText(text);
    if (!synthesisRef.current) return;

    // Stop ongoing speech & listening
    synthesisRef.current.cancel();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    if (isMuted) {
      startListening();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeLang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = activeLang === "hi" ? 0.9 : 0.95;

    utterance.onend = () => {
      startListening();
    };

    utterance.onerror = () => {
      startListening();
    };

    synthesisRef.current.speak(utterance);
  };

  useEffect(() => {
    speakAndListenRef.current = speakAndListen;
  }, [isMuted, isListening, language]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Set up recognition event handlers
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      setIsListening(false);
      if (handleVoiceInputRef.current) {
        handleVoiceInputRef.current(resultText);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.warn("Recognition error event:", event.error);
      setIsListening(false);
      
      if (event.error === "no-speech") {
        if (speakAndListenRef.current) {
          const p = PROMPTS[language];
          speakAndListenRef.current(p.noSpeech);
        }
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [language]);

  // AI Voice Parsing call helper
  const parseWithAI = async (targetStep: string, rawInput: string) => {
    try {
      const res = await fetch("/api/booking/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: targetStep, transcript: rawInput, language })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cleanValue) return data.cleanValue;
      }
    } catch (e) {
      console.warn("AI parse call failed, using fallback:", e);
    }
    return null;
  };

  // Main Dialog State Machine
  const handleVoiceInput = async (input: string) => {
    const cleanInput = input.trim();
    if (!cleanInput) return;

    const p = PROMPTS[language];

    switch (step) {
      case "name": {
        let extractedName = await parseWithAI("name", cleanInput);
        if (!extractedName) {
          extractedName = cleanInput
            .replace(/^(my name is|i am|im|mera naam hai|mera naam|naam hai|naam|this is|i'm|मेरा नाम है|मेरा नाम|नाम|मैं हूँ)\s+/i, "")
            .replace(/\s+(hai|है)$/i, "");
          extractedName = extractedName.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }

        setFormData((prev: any) => ({ ...prev, fullName: extractedName }));
        setStep("phone");
        speakAndListen(p.nameSuccess(extractedName));
        break;
      }

      case "phone": {
        let phoneNumber = await parseWithAI("phone", cleanInput);
        if (!phoneNumber || phoneNumber.length < 10) {
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
          if (digits.length >= 10) {
            phoneNumber = digits.slice(-10);
          }
        }

        if (phoneNumber && phoneNumber.length >= 10) {
          setFormData((prev: any) => ({ ...prev, phone: phoneNumber }));
          setStep("email");
          speakAndListen(p.phoneSuccess);
        } else {
          speakAndListen(p.invalidPhone);
        }
        break;
      }

      case "email": {
        let emailClean = await parseWithAI("email", cleanInput);
        if (!emailClean) {
          emailClean = cleanInput
            .toLowerCase()
            .replace(/\s+(at the rate of|at the rate|at rate|at|एट द रेट)\s+/gi, "@")
            .replace(/\s+(dot|point|डॉट)\s+/gi, ".")
            .replace(/\s+/g, "");

          emailClean = emailClean
            .replace(/@gmailcom$/i, "@gmail.com")
            .replace(/@yahoocom$/i, "@yahoo.com")
            .replace(/@hotmailcom$/i, "@hotmail.com")
            .replace(/@outlookcom$/i, "@outlook.com");

          if (emailClean.includes("@") && !emailClean.includes(".", emailClean.indexOf("@"))) {
            const parts = emailClean.split("@");
            if (parts[1] && !parts[1].includes(".")) {
              emailClean = `${parts[0]}@${parts[1]}.com`;
            }
          }
        }

        setFormData((prev: any) => ({ ...prev, email: emailClean }));
        setStep("address");
        speakAndListen(p.emailSuccess);
        break;
      }

      case "address": {
        let addressClean = await parseWithAI("address", cleanInput);
        if (!addressClean) addressClean = cleanInput;

        setFormData((prev: any) => ({ ...prev, address: addressClean }));
        setStep("age");
        speakAndListen(p.addressSuccess);
        break;
      }

      case "age": {
        let ageClean = await parseWithAI("age", cleanInput);
        if (!ageClean) ageClean = cleanInput.replace(/\D/g, "");

        if (ageClean && parseInt(ageClean, 10) > 0 && parseInt(ageClean, 10) < 120) {
          setFormData((prev: any) => ({ ...prev, age: ageClean }));
          setStep("gender");
          speakAndListen(p.ageSuccess);
        } else {
          speakAndListen(p.invalidAge);
        }
        break;
      }

      case "gender": {
        let genderClean = await parseWithAI("gender", cleanInput);
        if (!genderClean) {
          const lower = cleanInput.toLowerCase();
          if (lower.includes("female") || lower.includes("woman") || lower.includes("girl") || lower.includes("महिला") || lower.includes("फीमेल")) {
            genderClean = "Female";
          } else if (lower.includes("male") || lower.includes("man") || lower.includes("boy") || lower.includes("पुरुष") || lower.includes("मेल")) {
            genderClean = "Male";
          } else {
            genderClean = "Other";
          }
        }
        setFormData((prev: any) => ({ ...prev, gender: genderClean }));
        setStep("complete");
        speakAndListen(p.completeMsg);
        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    handleVoiceInputRef.current = handleVoiceInput;
  });

  // Handle toggling language midway
  const toggleLanguage = () => {
    const newLang: Language = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    const p = PROMPTS[newLang];

    let promptMsg = p.welcome;
    if (step === "name") promptMsg = p.welcome;
    else if (step === "phone") promptMsg = p.nameSuccess(formData.fullName || "Patient");
    else if (step === "email") promptMsg = p.phoneSuccess;
    else if (step === "address") promptMsg = p.emailSuccess;
    else if (step === "age") promptMsg = p.addressSuccess;
    else if (step === "gender") promptMsg = p.ageSuccess;
    else if (step === "complete") promptMsg = p.completeMsg;

    speakAndListen(promptMsg, newLang);
  };

  const startAssistant = () => {
    if (!isSupported) return;
    setIsOpen(true);
    setStep("name");
    const p = PROMPTS[language];
    speakAndListen(p.welcome);
  };

  const closeAssistant = () => {
    stopListening();
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsOpen(false);
    setStep("idle");
  };

  return (
    <>
      {/* 3D Floating AI Activator Button with Expanding Hover Badge */}
      {isSupported && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center group">
          {/* Expanding Hover Pill Badge */}
          <div className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap mr-3 pointer-events-none">
            <div className="px-4 py-2.5 bg-[#001B4B]/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-xs font-extrabold tracking-wide flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span>🎤 Book via Voice AI</span>
            </div>
          </div>

          {/* 3D Circular Avatar Button */}
          <button
            onClick={startAssistant}
            className="relative h-14 w-14 rounded-full bg-gradient-to-br from-[#02457A] via-[#018ABE] to-cyan-400 p-0.5 shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group-hover:rotate-6"
            title="Book via Voice AI"
          >
            {/* Outer Glowing Pulsing Aura Ring */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping opacity-75 -z-10" />

            {/* 3D Glass Inner Container with Avatar Icon */}
            <div className="h-full w-full rounded-full bg-slate-950/20 backdrop-blur-sm flex items-center justify-center overflow-hidden relative border border-white/30">
              <Image
                src="/3d-voice-avatar.png"
                alt="AI Voice Assistant"
                width={48}
                height={48}
                className="object-cover rounded-full transform group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Dynamic Sound Equalizer Overlay Pill at bottom */}
              <div className="absolute bottom-1 bg-slate-900/80 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white/20">
                <span className="h-1.5 w-0.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="h-2.5 w-0.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Assistant Modal/Drawer View */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-300">
            {/* Header info */}
            <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="h-5 w-5 text-brand-soft" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm tracking-wide">VOICE BOOKING ASSISTANT</h3>
                  <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mt-0.5">Narayan Homoeopathy</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Language Switch Toggle Button */}
                <button
                  onClick={toggleLanguage}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-white/15"
                  title="Switch Language / भाषा बदलें"
                >
                  <Globe className="h-3.5 w-3.5 text-brand-soft" />
                  <span>{language === "en" ? "हिंदी" : "English"}</span>
                </button>

                {/* Mute toggle button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title={isMuted ? "Unmute Assistant voice" : "Mute Assistant voice"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={closeAssistant}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content view */}
            <div className="p-6 space-y-6 flex-1 flex flex-col items-center justify-center min-h-[220px]">
              {/* Pulsing Visualizer Ring */}
              <div className="relative flex items-center justify-center">
                <div className={`absolute h-24 w-24 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 transition-all duration-700 ${isListening ? "animate-ping opacity-70 scale-125" : "scale-100"}`} />
                <div className={`absolute h-20 w-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 transition-all duration-500 ${isListening ? "scale-110" : "scale-100"}`} />
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isListening ? "bg-brand-secondary shadow-lg shadow-brand-secondary/30 scale-105" : "bg-brand-primary"}`}>
                  {isListening ? <Mic className="h-6 w-6 animate-pulse" /> : <MicOff className="h-6 w-6" />}
                </div>
              </div>

              {/* Speech transcript boxes */}
              <div className="text-center space-y-3 w-full px-4">
                <p className="text-sm font-semibold text-slate-700 leading-relaxed min-h-[48px] max-w-sm mx-auto">
                  {assistantText}
                </p>
                
                {/* User spoke transcript feedback block */}
                {transcript && (
                  <div className="py-2 px-4 bg-slate-50 border border-slate-100 rounded-xl inline-block text-xs font-bold text-slate-500 max-w-[90%] mx-auto italic">
                    " {transcript} "
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic steps tracker footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                LANG: {language === "hi" ? "HINDI (हिंदी)" : "ENGLISH"} | STEP: {step.toUpperCase()}
              </span>
              {step === "complete" ? (
                <button
                  onClick={closeAssistant}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-secondary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary/90 transition-all cursor-pointer"
                >
                  <Check className="h-3 w-3" />
                  <span>DONE</span>
                </button>
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
