import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header/Header";
import PromptInput from "../../components/PromptInput/PromptInput";
import ImageGrid from "../../components/ImageGrid/ImageGrid";
import Sidebar from "../../components/Sidebar/Sidebar";
import { savePromptHistory } from "../../db/database";
import { generateImagesFromAllModels } from "../../services/imageApi";
import "./ImageGenerate.scss";

const ImageGenerate = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [lastPrompt, setLastPrompt] = useState("");
  const [images, setImages] = useState({
    dalle3: null,
    imagen3: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    const currentPrompt = prompt;
    setLastPrompt(currentPrompt);
    setPrompt(""); // clear input
    setIsGenerating(true); // spinner on
    setErrors({});
    setImages({ dalle3: null, imagen3: null }); // clear previews to placeholders

    try {
      toast.info("🎨 Generating images from backend...", { autoClose: 2000 });

      const results = await generateImagesFromAllModels(currentPrompt);

      const newImages = {};
      const newErrors = {};

      results.forEach((r) => {
        if (r.success) {
          newImages[r.modelKey] = r.imageUrl;
        } else {
          newErrors[r.modelKey] = r.error || "Generation failed";
        }
      });

      // update UI
      setImages((prev) => ({ ...prev, ...newImages }));
      setErrors((prev) => ({ ...prev, ...newErrors }));

      // save only if at least one success
      if (Object.keys(newImages).length > 0) {
        await savePromptHistory(currentPrompt, newImages);
        setRefreshHistory((v) => v + 1);
      }

      const successCount = Object.keys(newImages).length;
      const failCount = Object.keys(newErrors).length;

      if (successCount > 0) {
        toast.success(`Generated ${successCount} image(s)`);
      }
      if (failCount > 0) {
        toast.warning(`${failCount} image(s) failed`);
      }
      if (successCount === 0 && failCount === 0) {
        toast.error("No images generated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Backend error while generating images");
      setErrors({
        dalle3: err.message,
        imagen3: err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPrompt = (historyItem) => {
    setPrompt(historyItem.prompt);
    setLastPrompt(historyItem.prompt);
    setErrors({});
    if (historyItem.images) {
      setImages(historyItem.images);
    }
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
    toast.info("Loaded from history");
  };

  return (
    <div className="image-generate-page">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectPrompt={handleSelectPrompt}
        refreshTrigger={refreshHistory}
      />

      <div
        className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <Header onMenuClick={toggleSidebar} />
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
        <ImageGrid
          images={images}
          isGenerating={isGenerating}
          errors={errors}
          lastPrompt={lastPrompt}
        />
      </div>
    </div>
  );
};

export default ImageGenerate;
