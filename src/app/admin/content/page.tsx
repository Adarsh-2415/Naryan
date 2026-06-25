"use client";

import { useEffect, useState, useRef } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  Award, 
  MessageSquare, 
  BookOpen,
  Video,
  Layers,
  Settings,
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Star,
  Globe,
  Share2,
  Bold,
  Italic,
  List,
  Heading2,
  Link2
} from "lucide-react";

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState<
    "slider" | "gallery" | "awards" | "testimonials" | "case-studies" | "seminars" | "treatments" | "about"
  >("slider");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data lists
  const [slides, setSlides] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [seminars, setSeminars] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);

  // --- Home Slides Form State ---
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideSort, setSlideSort] = useState(0);
  const [slideImage, setSlideImage] = useState<File | null>(null);
  const [slidePreviewUrl, setSlidePreviewUrl] = useState("");

  // --- Gallery Form State ---
  const [galleryCaption, setGalleryCaption] = useState("");
  const [gallerySort, setGallerySort] = useState(0);
  const [galleryStatus, setGalleryStatus] = useState("published");
  const [galleryImage, setGalleryImage] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState("");

  // --- Awards Form State ---
  const [awardTitle, setAwardTitle] = useState("");
  const [awardSort, setAwardSort] = useState(0);
  const [awardStatus, setAwardStatus] = useState("published");
  const [awardImage, setAwardImage] = useState<File | null>(null);
  const [awardPreviewUrl, setAwardPreviewUrl] = useState("");
  const [awardSeoTitle, setAwardSeoTitle] = useState("");
  const [awardSeoDesc, setAwardSeoDesc] = useState("");

  // --- Testimonials Form State ---
  const [testName, setTestName] = useState("");
  const [testTreatment, setTestTreatment] = useState("");
  const [testText, setTestText] = useState("");
  const [testRating, setTestRating] = useState(5);
  const [testSort, setTestSort] = useState(0);
  const [testFeatured, setTestFeatured] = useState(false);
  const [testStatus, setTestStatus] = useState("published");
  const [testImage, setTestImage] = useState<File | null>(null);
  const [testPreviewUrl, setTestPreviewUrl] = useState("");
  const [testSeoTitle, setTestSeoTitle] = useState("");
  const [testSeoDesc, setTestSeoDesc] = useState("");

  // --- Case Studies Form State ---
  const [caseTitle, setCaseTitle] = useState("");
  const [caseSlug, setCaseSlug] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [caseContent, setCaseContent] = useState("");
  const [caseCategory, setCaseCategory] = useState("");
  const [caseSort, setCaseSort] = useState(0);
  const [caseFeatured, setCaseFeatured] = useState(false);
  const [caseStatus, setCaseStatus] = useState("published");
  const [caseImage, setCaseImage] = useState<File | null>(null);
  const [casePreviewUrl, setCasePreviewUrl] = useState("");
  const [caseSeoTitle, setCaseSeoTitle] = useState("");
  const [caseSeoDesc, setCaseSeoDesc] = useState("");

  // --- Seminars Form State ---
  const [seminarTitle, setSeminarTitle] = useState("");
  const [seminarDesc, setSeminarDesc] = useState("");
  const [seminarSort, setSeminarSort] = useState(0);
  const [seminarStatus, setSeminarStatus] = useState("published");
  const [seminarImage, setSeminarImage] = useState<File | null>(null);
  const [seminarPreviewUrl, setSeminarPreviewUrl] = useState("");
  const [seminarSeoTitle, setSeminarSeoTitle] = useState("");
  const [seminarSeoDesc, setSeminarSeoDesc] = useState("");

  // --- Treatments Form State ---
  const [treatmentTitle, setTreatmentTitle] = useState("");
  const [treatmentSlug, setTreatmentSlug] = useState("");
  const [treatmentShortDesc, setTreatmentShortDesc] = useState("");
  const [treatmentFull, setTreatmentFull] = useState("");
  const [treatmentSort, setTreatmentSort] = useState(0);
  const [treatmentFeatured, setTreatmentFeatured] = useState(false);
  const [treatmentStatus, setTreatmentStatus] = useState("published");
  const [treatmentImage, setTreatmentImage] = useState<File | null>(null);
  const [treatmentPreviewUrl, setTreatmentPreviewUrl] = useState("");
  const [treatmentSeoTitle, setTreatmentSeoTitle] = useState("");
  const [treatmentSeoDesc, setTreatmentSeoDesc] = useState("");

  // --- About Page Configuration State ---
  const [aboutHeroTitle, setAboutHeroTitle] = useState("");
  const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState("");
  const [aboutStoryContent, setAboutStoryContent] = useState("");
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const [aboutPreviewUrl, setAboutPreviewUrl] = useState("");
  const [aboutShowMissionVision, setAboutShowMissionVision] = useState(true);
  const [aboutMissionText, setAboutMissionText] = useState("");
  const [aboutVisionText, setAboutVisionText] = useState("");
  const [aboutShowStats, setAboutShowStats] = useState(true);
  const [aboutStatsYears, setAboutStatsYears] = useState("15+");
  const [aboutStatsPatients, setAboutStatsPatients] = useState("10k+");
  const [aboutStatsSatisfaction, setAboutStatsSatisfaction] = useState("99%");
  const [aboutShowValues, setAboutShowValues] = useState(true);
  const [aboutCard1Title, setAboutCard1Title] = useState("");
  const [aboutCard1Desc, setAboutCard1Desc] = useState("");
  const [aboutCard2Title, setAboutCard2Title] = useState("");
  const [aboutCard2Desc, setAboutCard2Desc] = useState("");
  const [aboutCard3Title, setAboutCard3Title] = useState("");
  const [aboutCard3Desc, setAboutCard3Desc] = useState("");
  const [aboutCard4Title, setAboutCard4Title] = useState("");
  const [aboutCard4Desc, setAboutCard4Desc] = useState("");

  // Textarea Refs for Rich Editor insert helpers
  const caseTextareaRef = useRef<HTMLTextAreaElement>(null);
  const treatmentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const aboutTextareaRef = useRef<HTMLTextAreaElement>(null);

  const loadData = () => {
    setLoading(true);
    
    if (activeTab === "about") {
      fetch("/api/admin/content/about")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) {
            const conf = data.config;
            setAboutHeroTitle(conf.hero_title || "");
            setAboutHeroSubtitle(conf.hero_subtitle || "");
            setAboutStoryContent(conf.story_content || "");
            setAboutPreviewUrl(conf.hero_image_url || "");
            setAboutShowMissionVision(conf.show_mission_vision);
            setAboutMissionText(conf.mission_text || "");
            setAboutVisionText(conf.vision_text || "");
            setAboutShowStats(conf.show_clinic_stats);
            setAboutStatsYears(conf.stats_years_count || "15+");
            setAboutStatsPatients(conf.stats_patients_count || "10k+");
            setAboutStatsSatisfaction(conf.stats_satisfaction_rate || "99%");
            setAboutShowValues(conf.show_values_grid);
            setAboutCard1Title(conf.value_card1_title || "");
            setAboutCard1Desc(conf.value_card1_desc || "");
            setAboutCard2Title(conf.value_card2_title || "");
            setAboutCard2Desc(conf.value_card2_desc || "");
            setAboutCard3Title(conf.value_card3_title || "");
            setAboutCard3Desc(conf.value_card3_desc || "");
            setAboutCard4Title(conf.value_card4_title || "");
            setAboutCard4Desc(conf.value_card4_desc || "");
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      return;
    }

    const endpoint = `/api/admin/content/${activeTab}`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (activeTab === "slider") setSlides(data.slides || []);
          if (activeTab === "gallery") setGallery(data.images || []);
          if (activeTab === "awards") setAwards(data.awards || []);
          if (activeTab === "testimonials") setTestimonials(data.testimonials || []);
          if (activeTab === "case-studies") setCaseStudies(data.caseStudies || []);
          if (activeTab === "seminars") setSeminars(data.seminars || []);
          if (activeTab === "treatments") setTreatments(data.treatments || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Asset uploader
  const uploadAsset = async (file: File, bucket: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const res = await fetch("/api/admin/content/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data.url;
  };

  const validateFile = (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Unsupported file type. Use JPG, PNG or WEBP.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  // Rich Editor format inserter helper
  const insertFormat = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    formatType: "bold" | "italic" | "heading" | "list" | "link",
    setter: (val: string) => void,
    currentValue: string
  ) => {
    const textarea = ref.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    if (formatType === "bold") replacement = `**${selected || "bold text"}**`;
    if (formatType === "italic") replacement = `*${selected || "italic text"}*`;
    if (formatType === "heading") replacement = `\n## ${selected || "Heading"}\n`;
    if (formatType === "list") replacement = `\n- ${selected || "List item"}\n`;
    if (formatType === "link") replacement = `[${selected || "link text"}](https://example.com)`;

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    setter(updatedText);
    
    // Reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Submit handlers
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage) return alert("Select a slide image.");
    setSubmitting(true);
    try {
      const publicUrl = await uploadAsset(slideImage, "home-slides");
      const res = await fetch("/api/admin/content/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          title: slideTitle,
          subtitle: slideSubtitle,
          sortOrder: slideSort,
        }),
      });
      if ((await res.json()).success) {
        setSlideTitle(""); setSlideSubtitle(""); setSlideSort(0); setSlideImage(null); setSlidePreviewUrl("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImage) return alert("Select a gallery image.");
    setSubmitting(true);
    try {
      const publicUrl = await uploadAsset(galleryImage, "gallery");
      const res = await fetch("/api/admin/content/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          caption: galleryCaption,
          status: galleryStatus,
          sortOrder: gallerySort,
        }),
      });
      if ((await res.json()).success) {
        setGalleryCaption(""); setGallerySort(0); setGalleryImage(null); setGalleryPreviewUrl("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardImage) return alert("Select an award image.");
    setSubmitting(true);
    try {
      const publicUrl = await uploadAsset(awardImage, "awards");
      const res = await fetch("/api/admin/content/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrl,
          title: awardTitle,
          status: awardStatus,
          displayOrder: awardSort,
          seoTitle: awardSeoTitle,
          seoDescription: awardSeoDesc
        }),
      });
      if ((await res.json()).success) {
        setAwardTitle(""); setAwardSort(0); setAwardImage(null); setAwardPreviewUrl(""); setAwardSeoTitle(""); setAwardSeoDesc("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let avatarUrl = "";
      if (testImage) avatarUrl = await uploadAsset(testImage, "testimonials");
      const res = await fetch("/api/admin/content/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: testName,
          treatmentReceived: testTreatment,
          testimonialText: testText,
          rating: testRating,
          patientImageUrl: avatarUrl || null,
          displayOrder: testSort,
          featured: testFeatured,
          status: testStatus,
          seoTitle: testSeoTitle,
          seoDescription: testSeoDesc
        }),
      });
      if ((await res.json()).success) {
        setTestName(""); setTestTreatment(""); setTestText(""); setTestRating(5); setTestSort(0); setTestFeatured(false); setTestImage(null); setTestPreviewUrl(""); setTestSeoTitle(""); setTestSeoDesc("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let coverUrl = "";
      if (caseImage) coverUrl = await uploadAsset(caseImage, "case-studies");
      const res = await fetch("/api/admin/content/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: caseTitle,
          slug: caseSlug,
          summary: caseSummary,
          content: caseContent,
          category: caseCategory,
          imageUrl: coverUrl || null,
          status: caseStatus,
          displayOrder: caseSort,
          featured: caseFeatured,
          seoTitle: caseSeoTitle,
          seoDescription: caseSeoDesc
        }),
      });
      if ((await res.json()).success) {
        setCaseTitle(""); setCaseSlug(""); setCaseSummary(""); setCaseContent(""); setCaseCategory(""); setCaseSort(0); setCaseFeatured(false); setCaseImage(null); setCasePreviewUrl(""); setCaseSeoTitle(""); setCaseSeoDesc("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddSeminar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seminarImage) return alert("Upload a seminar poster image.");
    setSubmitting(true);
    try {
      const publicUrl = await uploadAsset(seminarImage, "seminars");
      const res = await fetch("/api/admin/content/seminars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: seminarTitle,
          description: seminarDesc,
          imageUrl: publicUrl,
          status: seminarStatus,
          displayOrder: seminarSort,
          seoTitle: seminarSeoTitle,
          seoDescription: seminarSeoDesc
        }),
      });
      if ((await res.json()).success) {
        setSeminarTitle(""); setSeminarDesc(""); setSeminarSort(0); setSeminarImage(null); setSeminarPreviewUrl(""); setSeminarSeoTitle(""); setSeminarSeoDesc("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let graphicUrl = "";
      if (treatmentImage) graphicUrl = await uploadAsset(treatmentImage, "treatments");
      const res = await fetch("/api/admin/content/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: treatmentTitle,
          slug: treatmentSlug,
          shortDescription: treatmentShortDesc,
          fullContent: treatmentFull,
          imageUrl: graphicUrl || null,
          status: treatmentStatus,
          displayOrder: treatmentSort,
          featured: treatmentFeatured,
          seoTitle: treatmentSeoTitle,
          seoDescription: treatmentSeoDesc
        }),
      });
      if ((await res.json()).success) {
        setTreatmentTitle(""); setTreatmentSlug(""); setTreatmentShortDesc(""); setTreatmentFull(""); setTreatmentSort(0); setTreatmentFeatured(false); setTreatmentImage(null); setTreatmentPreviewUrl(""); setTreatmentSeoTitle(""); setTreatmentSeoDesc("");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalImgUrl = aboutPreviewUrl;
      if (aboutImage) {
        finalImgUrl = await uploadAsset(aboutImage, "about");
      }
      const res = await fetch("/api/admin/content/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTitle: aboutHeroTitle,
          heroSubtitle: aboutHeroSubtitle,
          heroImageUrl: finalImgUrl,
          storyContent: aboutStoryContent,
          showMissionVision: aboutShowMissionVision,
          missionText: aboutMissionText,
          visionText: aboutVisionText,
          showClinicStats: aboutShowStats,
          statsYearsCount: aboutStatsYears,
          statsPatientsCount: aboutStatsPatients,
          statsSatisfactionRate: aboutStatsSatisfaction,
          showValuesGrid: aboutShowValues,
          valueCard1Title: aboutCard1Title,
          valueCard1Desc: aboutCard1Desc,
          valueCard2Title: aboutCard2Title,
          valueCard2Desc: aboutCard2Desc,
          valueCard3Title: aboutCard3Title,
          valueCard3Desc: aboutCard3Desc,
          valueCard4Title: aboutCard4Title,
          valueCard4Desc: aboutCard4Desc
        }),
      });
      if ((await res.json()).success) {
        alert("About page configuration saved successfully!");
        loadData();
      }
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this record and its storage file?")) return;
    fetch(`/api/admin/content/${activeTab}?id=${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => { if (data.success) loadData(); })
      .catch((err) => console.error(err));
  };

  // SEO Preview helper variables
  const currentSeoTitle = 
    activeTab === "awards" ? awardSeoTitle : 
    activeTab === "testimonials" ? testSeoTitle :
    activeTab === "case-studies" ? caseSeoTitle :
    activeTab === "seminars" ? seminarSeoTitle :
    activeTab === "treatments" ? treatmentSeoTitle : "";

  const currentSeoDesc = 
    activeTab === "awards" ? awardSeoDesc : 
    activeTab === "testimonials" ? testSeoDesc :
    activeTab === "case-studies" ? caseSeoDesc :
    activeTab === "seminars" ? seminarSeoDesc :
    activeTab === "treatments" ? treatmentSeoDesc : "";

  const hasSeo = ["awards", "testimonials", "case-studies", "seminars", "treatments"].includes(activeTab);

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-brand-dark flex items-center gap-2">
          <FileText className="text-[#02457A]" />
          <span>Unified CMS & Content Studio</span>
        </h1>
        <p className="text-sm text-text-body">Manage all website page content, listings, and metadata dynamically backed by Supabase.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto shrink-0 pb-1 gap-1">
        {[
          { id: "slider", label: "Home Slider", icon: ImageIcon },
          { id: "gallery", label: "Gallery", icon: ImageIcon },
          { id: "awards", label: "Awards", icon: Award },
          { id: "testimonials", label: "Testimonials", icon: MessageSquare },
          { id: "case-studies", label: "Case Studies", icon: BookOpen },
          { id: "seminars", label: "Seminars", icon: Video },
          { id: "treatments", label: "Treatments", icon: Layers },
          { id: "about", label: "About Page", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#02457A] text-[#02457A]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Form Editor (spans 2 except for About page layout) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-sm text-brand-dark border-b border-slate-50 pb-3 uppercase tracking-wider">
              {activeTab === "about" ? "Configure About Predefined Sections" : `Add New ${activeTab.replace("-", " ")}`}
            </h3>

            {/* TAB 1: SLIDES */}
            {activeTab === "slider" && (
              <form onSubmit={handleAddSlide} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Image Asset File</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setSlideImage(file); setSlidePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {slidePreviewUrl ? (
                      <img src={slidePreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400">
                        <Upload className="mx-auto h-6 w-6" />
                        <p className="text-[11px] font-bold">Upload Slide Image (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Heading Title (Optional)</label>
                    <input type="text" value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Sort Order</label>
                    <input type="number" value={slideSort} onChange={(e) => setSlideSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Subtitle Description (Optional)</label>
                  <textarea rows={2} value={slideSubtitle} onChange={(e) => setSlideSubtitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Uploading..." : "Add Slide"}
                </button>
              </form>
            )}

            {/* TAB 2: GALLERY */}
            {activeTab === "gallery" && (
              <form onSubmit={handleAddGallery} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Photo File</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setGalleryImage(file); setGalleryPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {galleryPreviewUrl ? (
                      <img src={galleryPreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400"><Upload className="mx-auto h-6 w-6" /><p className="text-[11px] font-bold">Select Photo File</p></div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Caption Title</label>
                  <input type="text" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Sort Order</label>
                    <input type="number" value={gallerySort} onChange={(e) => setGallerySort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={galleryStatus} onChange={(e) => setGalleryStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Uploading..." : "Add Gallery Image"}
                </button>
              </form>
            )}

            {/* TAB 3: AWARDS */}
            {activeTab === "awards" && (
              <form onSubmit={handleAddAward} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Award Image (Required)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setAwardImage(file); setAwardPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {awardPreviewUrl ? (
                      <img src={awardPreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400"><Upload className="mx-auto h-6 w-6" /><p className="text-[11px] font-bold">Select Award File</p></div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Award Title (Optional)</label>
                  <input type="text" value={awardTitle} onChange={(e) => setAwardTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Display Order</label>
                    <input type="number" value={awardSort} onChange={(e) => setAwardSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={awardStatus} onChange={(e) => setAwardStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                {/* SEO Sub-section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">SEO tags</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Title</label>
                    <input type="text" value={awardSeoTitle} onChange={(e) => setAwardSeoTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Description</label>
                    <textarea rows={2} value={awardSeoDesc} onChange={(e) => setAwardSeoDesc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Saving..." : "Add Award"}
                </button>
              </form>
            )}

            {/* TAB 4: TESTIMONIALS */}
            {activeTab === "testimonials" && (
              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Patient Photo (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setTestImage(file); setTestPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {testPreviewUrl ? (
                      <img src={testPreviewUrl} alt="Preview" className="h-12 w-12 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="text-slate-400"><Upload className="mx-auto h-5 w-5" /><p className="text-[10px] font-bold">Select File</p></div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Patient Name</label>
                    <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Treatment Received</label>
                    <input type="text" value={testTreatment} onChange={(e) => setTestTreatment(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Feedback Description</label>
                  <textarea rows={3} value={testText} onChange={(e) => setTestText(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Rating</label>
                    <select value={testRating} onChange={(e) => setTestRating(parseInt(e.target.value) || 5)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Display Order</label>
                    <input type="number" value={testSort} onChange={(e) => setTestSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={testStatus} onChange={(e) => setTestStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 py-1">
                  <input type="checkbox" id="testFeat" checked={testFeatured} onChange={(e) => setTestFeatured(e.target.checked)} className="rounded text-[#02457A] cursor-pointer h-4 w-4" />
                  <label htmlFor="testFeat" className="text-xs text-slate-500 font-bold cursor-pointer">Mark as Featured Testimonial</label>
                </div>
                {/* SEO Sub-section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">SEO tags</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Title</label>
                    <input type="text" value={testSeoTitle} onChange={(e) => setTestSeoTitle(target => e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Description</label>
                    <textarea rows={2} value={testSeoDesc} onChange={(e) => setTestSeoDesc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Saving..." : "Add Testimonial"}
                </button>
              </form>
            )}

            {/* TAB 5: CASE STUDIES */}
            {activeTab === "case-studies" && (
              <form onSubmit={handleAddCase} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Featured Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setCaseImage(file); setCasePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {casePreviewUrl ? (
                      <img src={casePreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400"><Upload className="mx-auto h-6 w-6" /><p className="text-[11px] font-bold">Select Cover Graphic File</p></div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Case Study Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Chronic Migraine Treatment Success"
                      value={caseTitle}
                      onChange={(e) => {
                        setCaseTitle(e.target.value);
                        setCaseSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                        setCaseSeoTitle(`Case Study: ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Auto Generated Slug URL</label>
                    <input type="text" value={caseSlug} onChange={(e) => setCaseSlug(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50" required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Category Tag</label>
                    <input type="text" placeholder="e.g. Migraine" value={caseCategory} onChange={(e) => setCaseCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Order</label>
                    <input type="number" value={caseSort} onChange={(e) => setCaseSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={caseStatus} onChange={(e) => setCaseStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Summary description (Card brief)</label>
                  <textarea rows={2} value={caseSummary} onChange={(e) => setCaseSummary(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                </div>

                {/* RICH TEXT EDITOR SECTION */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500">Full Content Text (Rich Editor)</label>
                    {/* Rich text formatting tools */}
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden text-slate-500 bg-slate-50">
                      <button type="button" onClick={() => insertFormat(caseTextareaRef, "bold", setCaseContent, caseContent)} className="p-1.5 hover:bg-slate-200 hover:text-brand-dark border-r border-slate-200 cursor-pointer" title="Bold Text"><Bold size={13} /></button>
                      <button type="button" onClick={() => insertFormat(caseTextareaRef, "italic", setCaseContent, caseContent)} className="p-1.5 hover:bg-slate-200 hover:text-brand-dark border-r border-slate-200 cursor-pointer" title="Italic Text"><Italic size={13} /></button>
                      <button type="button" onClick={() => insertFormat(caseTextareaRef, "heading", setCaseContent, caseContent)} className="p-1.5 hover:bg-slate-200 hover:text-brand-dark border-r border-slate-200 cursor-pointer" title="Heading H2"><Heading2 size={13} /></button>
                      <button type="button" onClick={() => insertFormat(caseTextareaRef, "list", setCaseContent, caseContent)} className="p-1.5 hover:bg-slate-200 hover:text-brand-dark border-r border-slate-200 cursor-pointer" title="Bullet List"><List size={13} /></button>
                      <button type="button" onClick={() => insertFormat(caseTextareaRef, "link", setCaseContent, caseContent)} className="p-1.5 hover:bg-slate-200 hover:text-brand-dark cursor-pointer" title="Insert Link"><Link2 size={13} /></button>
                    </div>
                  </div>
                  <textarea
                    ref={caseTextareaRef}
                    rows={6}
                    placeholder="Enter clinical notes, symptoms overview, remedies applied, and recovery stages..."
                    value={caseContent}
                    onChange={(e) => setCaseContent(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center gap-2.5 py-1">
                  <input type="checkbox" id="caseFeat" checked={caseFeatured} onChange={(e) => setCaseFeatured(e.target.checked)} className="rounded text-[#02457A] cursor-pointer h-4 w-4" />
                  <label htmlFor="caseFeat" className="text-xs text-slate-500 font-bold cursor-pointer">Mark as Featured Case Study</label>
                </div>

                {/* SEO Sub-section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">SEO metadata</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Title</label>
                    <input type="text" value={caseSeoTitle} onChange={(e) => setCaseSeoTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Description</label>
                    <textarea rows={2} value={caseSeoDesc} onChange={(e) => setCaseSeoDesc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Saving..." : "Add Case Study"}
                </button>
              </form>
            )}

            {/* TAB 6: SEMINARS */}
            {activeTab === "seminars" && (
              <form onSubmit={handleAddSeminar} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Seminar Poster Image (Required)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setSeminarImage(file); setSeminarPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {seminarPreviewUrl ? (
                      <img src={seminarPreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400"><Upload className="mx-auto h-6 w-6" /><p className="text-[11px] font-bold">Select Poster Graphic File</p></div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Seminar Title (Optional)</label>
                    <input type="text" value={seminarTitle} onChange={(e) => setSeminarTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Order</label>
                      <input type="number" value={seminarSort} onChange={(e) => setSeminarSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Status</label>
                      <select value={seminarStatus} onChange={(e) => setSeminarStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Description Copy (Optional)</label>
                  <textarea rows={2} value={seminarDesc} onChange={(e) => setSeminarDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                </div>

                {/* SEO Sub-section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">SEO tags</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Title</label>
                    <input type="text" value={seminarSeoTitle} onChange={(e) => setSeminarSeoTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Description</label>
                    <textarea rows={2} value={seminarSeoDesc} onChange={(e) => setSeminarSeoDesc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Saving..." : "Add Seminar"}
                </button>
              </form>
            )}

            {/* TAB 7: TREATMENTS */}
            {activeTab === "treatments" && (
              <form onSubmit={handleAddTreatment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Treatment Banner Icon (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateFile(file)) {
                          setTreatmentImage(file); setTreatmentPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {treatmentPreviewUrl ? (
                      <img src={treatmentPreviewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-1 text-slate-400"><Upload className="mx-auto h-6 w-6" /><p className="text-[11px] font-bold">Select Icon Graphic File</p></div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Treatment Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Constitutional Homeopathy"
                      value={treatmentTitle}
                      onChange={(e) => {
                        setTreatmentTitle(e.target.value);
                        setTreatmentSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                        setTreatmentSeoTitle(`Narayan Clinic | ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">URL Slug</label>
                    <input type="text" value={treatmentSlug} onChange={(e) => setTreatmentSlug(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50" required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Display Order</label>
                    <input type="number" value={treatmentSort} onChange={(e) => setTreatmentSort(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Status</label>
                    <select value={treatmentStatus} onChange={(e) => setTreatmentStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Featured Services</label>
                    <div className="flex items-center h-9">
                      <input type="checkbox" id="testTreatFeat" checked={treatmentFeatured} onChange={(e) => setTreatmentFeatured(e.target.checked)} className="rounded text-[#02457A] cursor-pointer h-4 w-4 mr-2" />
                      <label htmlFor="testTreatFeat" className="text-[11px] text-slate-500 font-bold cursor-pointer">Featured</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Short Description</label>
                  <textarea rows={2} value={treatmentShortDesc} onChange={(e) => setTreatmentShortDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" required />
                </div>

                {/* RICH TEXT EDITOR SECTION */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500">Full Content Text (Rich Editor)</label>
                    {/* Rich text formatting tools */}
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden text-slate-500 bg-slate-50">
                      <button type="button" onClick={() => insertFormat(treatmentTextareaRef, "bold", setTreatmentFull, treatmentFull)} className="p-1.5 hover:bg-slate-200 border-r border-slate-200 cursor-pointer"><Bold size={13} /></button>
                      <button type="button" onClick={() => insertFormat(treatmentTextareaRef, "italic", setTreatmentFull, treatmentFull)} className="p-1.5 hover:bg-slate-200 border-r border-slate-200 cursor-pointer"><Italic size={13} /></button>
                      <button type="button" onClick={() => insertFormat(treatmentTextareaRef, "heading", setTreatmentFull, treatmentFull)} className="p-1.5 hover:bg-slate-200 border-r border-slate-200 cursor-pointer"><Heading2 size={13} /></button>
                      <button type="button" onClick={() => insertFormat(treatmentTextareaRef, "list", setTreatmentFull, treatmentFull)} className="p-1.5 hover:bg-slate-200 border-r border-slate-200 cursor-pointer"><List size={13} /></button>
                      <button type="button" onClick={() => insertFormat(treatmentTextareaRef, "link", setTreatmentFull, treatmentFull)} className="p-1.5 hover:bg-slate-200 cursor-pointer"><Link2 size={13} /></button>
                    </div>
                  </div>
                  <textarea
                    ref={treatmentTextareaRef}
                    rows={6}
                    placeholder="Enter in-depth evaluations of constitutional homeopathy protocols..."
                    value={treatmentFull}
                    onChange={(e) => setTreatmentFull(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs leading-relaxed"
                    required
                  />
                </div>

                {/* SEO Sub-section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">SEO metadata</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Title</label>
                    <input type="text" value={treatmentSeoTitle} onChange={(e) => setTreatmentSeoTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">SEO Description</label>
                    <textarea rows={2} value={treatmentSeoDesc} onChange={(e) => setTreatmentSeoDesc(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow cursor-pointer">
                  {submitting ? "Saving..." : "Add Treatment"}
                </button>
              </form>
            )}

            {/* TAB 8: ABOUT PAGE CONFIG (UPSERT SINGLE ROW) */}
            {activeTab === "about" && (
              <form onSubmit={handleSaveAbout} className="space-y-6">
                
                {/* Hero section */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider border-b border-slate-50 pb-2">Hero Header Section</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Hero Main Title</label>
                      <input type="text" value={aboutHeroTitle} onChange={(e) => setAboutHeroTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Featured Header Graphic</label>
                      <div className="border border-dashed border-slate-200 rounded-xl p-2 text-center hover:bg-slate-50 relative flex items-center justify-between px-4 h-9">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && validateFile(file)) {
                              setAboutImage(file); setAboutPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{aboutImage ? aboutImage.name : "Select hero file"}</span>
                        <Upload size={14} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Hero Subtitle</label>
                    <textarea rows={2} value={aboutHeroSubtitle} onChange={(e) => setAboutHeroSubtitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                  </div>
                </div>

                {/* Rich Story */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider">Clinical Story Copy</span>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden text-slate-500 bg-slate-50">
                      <button type="button" onClick={() => insertFormat(aboutTextareaRef, "bold", setAboutStoryContent, aboutStoryContent)} className="p-1 hover:bg-slate-200 cursor-pointer"><Bold size={11} /></button>
                      <button type="button" onClick={() => insertFormat(aboutTextareaRef, "italic", setAboutStoryContent, aboutStoryContent)} className="p-1 hover:bg-slate-200 cursor-pointer"><Italic size={11} /></button>
                      <button type="button" onClick={() => insertFormat(aboutTextareaRef, "list", setAboutStoryContent, aboutStoryContent)} className="p-1 hover:bg-slate-200 cursor-pointer"><List size={11} /></button>
                    </div>
                  </div>
                  <textarea
                    ref={aboutTextareaRef}
                    rows={4}
                    value={aboutStoryContent}
                    onChange={(e) => setAboutStoryContent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs leading-relaxed"
                    required
                  />
                </div>

                {/* Mission / Vision text */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Mission & Vision Statements</span>
                    <button type="button" onClick={() => setAboutShowMissionVision(!aboutShowMissionVision)} className="text-xs font-bold text-[#02457A] hover:underline cursor-pointer">
                      {aboutShowMissionVision ? "Hide Section" : "Show Section"}
                    </button>
                  </div>
                  {aboutShowMissionVision && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Mission Statement</label>
                        <textarea rows={3} value={aboutMissionText} onChange={(e) => setAboutMissionText(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Vision Statement</label>
                        <textarea rows={3} value={aboutVisionText} onChange={(e) => setAboutVisionText(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Practice Statistics Strip</span>
                    <button type="button" onClick={() => setAboutShowStats(!aboutShowStats)} className="text-xs font-bold text-[#02457A] hover:underline cursor-pointer">
                      {aboutShowStats ? "Hide Section" : "Show Section"}
                    </button>
                  </div>
                  {aboutShowStats && (
                    <div className="grid grid-cols-3 gap-4 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Years of Experience</label>
                        <input type="text" value={aboutStatsYears} onChange={(e) => setAboutStatsYears(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Happy Patients</label>
                        <input type="text" value={aboutStatsPatients} onChange={(e) => setAboutStatsPatients(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Satisfaction Rate</label>
                        <input type="text" value={aboutStatsSatisfaction} onChange={(e) => setAboutStatsSatisfaction(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Core values block (4 fixed cards) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Predefined Core Values Cards (Exactly 4)</span>
                    <button type="button" onClick={() => setAboutShowValues(!aboutShowValues)} className="text-xs font-bold text-[#02457A] hover:underline cursor-pointer">
                      {aboutShowValues ? "Hide Grid" : "Show Grid"}
                    </button>
                  </div>
                  {aboutShowValues && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {/* Card 1 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">VALUE CARD 1</span>
                        <input type="text" value={aboutCard1Title} onChange={(e) => setAboutCard1Title(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold" placeholder="Title" required />
                        <textarea rows={2} value={aboutCard1Desc} onChange={(e) => setAboutCard1Desc(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs resize-none" placeholder="Description" required />
                      </div>
                      {/* Card 2 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">VALUE CARD 2</span>
                        <input type="text" value={aboutCard2Title} onChange={(e) => setAboutCard2Title(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold" placeholder="Title" required />
                        <textarea rows={2} value={aboutCard2Desc} onChange={(e) => setAboutCard2Desc(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs resize-none" placeholder="Description" required />
                      </div>
                      {/* Card 3 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">VALUE CARD 3</span>
                        <input type="text" value={aboutCard3Title} onChange={(e) => setAboutCard3Title(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold" placeholder="Title" required />
                        <textarea rows={2} value={aboutCard3Desc} onChange={(e) => setAboutCard3Desc(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs resize-none" placeholder="Description" required />
                      </div>
                      {/* Card 4 */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">VALUE CARD 4</span>
                        <input type="text" value={aboutCard4Title} onChange={(e) => setAboutCard4Title(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold" placeholder="Title" required />
                        <textarea rows={2} value={aboutCard4Desc} onChange={(e) => setAboutCard4Desc(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs resize-none" placeholder="Description" required />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>PUBLISH PREDEFINED SECTIONS</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Side: Previews / List Feed (spans 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* SEO LIVE PREVIEWS (SHOWS ONLY FOR TESTIMONIALS/AWARDS/CASE/SEMINARS/TREATMENTS) */}
          {hasSeo && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-50 flex items-center gap-2">
                <Globe size={16} className="text-[#02457A]" />
                <h4 className="font-heading font-bold text-xs text-brand-dark uppercase tracking-wider">Live SEO snippet</h4>
              </div>

              {/* Google Result Preview */}
              <div className="space-y-1.5 p-1 font-sans border-b border-slate-50 pb-5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Google Desktop Search Preview</span>
                <div className="text-[11px] text-[#202124] flex items-center gap-1 truncate mt-2">
                  <span>https://homoeopathy4u.com</span>
                  <span className="text-slate-400 font-bold">&gt;</span>
                  <span className="text-slate-500 capitalize">{activeTab.replace("-", "")}</span>
                </div>
                <div className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer truncate">
                  {currentSeoTitle || "Clinic Consultation | Narayan Clinic"}
                </div>
                <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                  {currentSeoDesc || "Provide metadata tags description to inspect desktop snippet rendering formats..."}
                </div>
              </div>

              {/* Social sharing card preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#02457A]">
                  <Share2 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Social Share Link Preview</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50">
                  <div className="h-32 bg-[#001B4B] flex items-center justify-center text-white relative">
                    {/* Display form preview avatar or default slide cover image if present */}
                    {activeTab === "case-studies" && casePreviewUrl ? (
                      <img src={casePreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : activeTab === "seminars" && seminarPreviewUrl ? (
                      <img src={seminarPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : activeTab === "treatments" && treatmentPreviewUrl ? (
                      <img src={treatmentPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-3">
                        <ImageIcon className="h-8 w-8 text-[#018ABE] mx-auto mb-1 animate-float" />
                        <p className="font-heading font-bold text-[9px] tracking-tight">Narayan Homoeopathic Chikitsalaya</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white space-y-1 border-t border-slate-100 text-xs">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">HOMOEOPATHY4U.COM</span>
                    <p className="font-bold text-slate-700 truncate">{currentSeoTitle || "Practice Consultation"}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{currentSeoDesc || "No meta description populated."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE REGISTRY ITEMS FEED (NOT FOR ABOUT PAGE WHICH IS SINGLE ROW) */}
          {activeTab !== "about" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-heading font-bold text-xs text-brand-dark uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center justify-between">
                <span>Active Registry</span>
                <span className="text-[9px] text-[#02457A] bg-[#02457A]/10 px-1.5 py-0.5 rounded font-extrabold">List view</span>
              </h4>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-[#02457A] mx-auto" /></div>
                ) : (
                  <>
                    {/* CASE STUDIES LIST */}
                    {activeTab === "case-studies" && (
                      caseStudies.length === 0 ? <p className="text-[10px] text-slate-400 text-center">Empty</p> :
                      caseStudies.map((c) => (
                        <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-700 truncate">{c.title}</h5>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">/{c.slug}</p>
                          </div>
                          <button onClick={() => handleDelete(c.id)} className="p-1 hover:text-red-500 text-slate-400 cursor-pointer shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))
                    )}

                    {/* SEMINARS LIST */}
                    {activeTab === "seminars" && (
                      seminars.length === 0 ? <p className="text-[10px] text-slate-400 text-center">Empty</p> :
                      seminars.map((s) => (
                        <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex items-center gap-3">
                            <img src={s.image_url} alt="Cover" className="h-9 w-14 rounded object-cover shrink-0" />
                            <h5 className="font-bold text-slate-700 truncate">{s.title || "Poster Only"}</h5>
                          </div>
                          <button onClick={() => handleDelete(s.id)} className="p-1 hover:text-red-500 text-slate-400 cursor-pointer shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))
                    )}

                    {/* TREATMENTS LIST */}
                    {activeTab === "treatments" && (
                      treatments.length === 0 ? <p className="text-[10px] text-slate-400 text-center">Empty</p> :
                      treatments.map((t) => (
                        <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-700 truncate">{t.title}</h5>
                            <p className="text-[10px] text-slate-400 truncate">Featured: {t.featured ? "Yes" : "No"}</p>
                          </div>
                          <button onClick={() => handleDelete(t.id)} className="p-1 hover:text-red-500 text-slate-400 cursor-pointer shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))
                    )}

                    {/* Fallback to Phase 1 preview tags if on Phase 1 tabs */}
                    {["slider", "gallery", "awards", "testimonials"].includes(activeTab) && (
                      <div className="text-center py-6 text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                        Use Grid filters on Left page columns to edit active Phase 1 cards.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ABOUT PAGE PREVIEW PANEL */}
          {activeTab === "about" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-heading font-bold text-xs text-brand-dark uppercase tracking-wider border-b border-slate-50 pb-3">
                Predefined About page Preview
              </h4>
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 space-y-2 text-xs">
                <p className="font-bold text-slate-800 leading-tight">Hero: {aboutHeroTitle || "Naturally Empowering Health"}</p>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{aboutHeroSubtitle || "No subtitle."}</p>
                <div className="h-20 bg-slate-200 rounded-lg overflow-hidden relative">
                  {aboutPreviewUrl ? (
                    <img src={aboutPreviewUrl} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400 absolute inset-0 flex items-center justify-center font-bold">No hero graphic uploaded</span>
                  )}
                </div>
                <div className="p-2 bg-white rounded border border-slate-100 text-[10px] space-y-1">
                  <p className="font-bold text-slate-700">Practice stats strip:</p>
                  <p className="text-slate-500">Exp: {aboutStatsYears} | Patients: {aboutStatsPatients} | Satisfaction: {aboutStatsSatisfaction}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
