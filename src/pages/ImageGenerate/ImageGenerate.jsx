import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header/Header";
import PromptInput from "../../components/PromptInput/PromptInput";
import ImageGrid from "../../components/ImageGrid/ImageGrid";
import Sidebar from "../../components/Sidebar/Sidebar";
import { savePromptHistory } from "../../db/database";
import {
  generateImagesFromAllModels,
  hasImagesForQuery,
} from "../../services/imageApi";
import "./ImageGenerate.scss";

const ImageGenerate = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [images, setImages] = useState({
    dalle3: null,
    imagen3: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Close sidebar by default on mobile
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    const currentPrompt = prompt;

    // Clear the input immediately after clicking send
    setPrompt("");

    // ALWAYS clear old images when Send is clicked
    setImages({
      dalle3: null,
      imagen3: null,
    });
    setErrors({});

    // Set loading state IMMEDIATELY
    setIsGenerating(true);

    // Check if mapping exists
    if (!hasImagesForQuery(currentPrompt)) {
      // Wait 2 seconds before showing error (spinner shows during this time)
      setTimeout(() => {
        setIsGenerating(false); // Stop spinner
        toast.error("❌ Could not generate images.", {
          autoClose: 4000,
        });
      }, 2000);

      return;
    }

    try {
      const results = await generateImagesFromAllModels(currentPrompt);

      if (results === null) {
        toast.error("❌ Could not generate images.", {
          autoClose: 4000,
        });
        return;
      }

      const newImages = {};
      const newErrors = {};

      results.forEach((result) => {
        if (result.success) {
          newImages[result.model] = result.imagePath;
        } else {
          newErrors[result.model] = result.error || "Generation failed";
        }
      });

      setImages(newImages);
      setErrors(newErrors);

      if (Object.keys(newImages).length > 0) {
        await savePromptHistory(currentPrompt, newImages);
        setRefreshHistory((prev) => prev + 1);
        console.log("✅ Saved to history:", currentPrompt);
      }

      const successCount = Object.keys(newImages).length;

      if (successCount > 0) {
        toast.success(`Successfully generated ${successCount} image(s)`);
      } else {
        toast.error("❌ Image generation failed");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      toast.error("Failed to generate images. Please try again.");
      setErrors({
        dalle3: error.message,
        imagen3: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSelectPrompt = (historyItem) => {
    setPrompt(historyItem.prompt);
    setErrors({});
    if (historyItem.images) {
      setImages(historyItem.images);
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Close sidebar after selection on mobile
    }
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
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
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
        />
      </div>
    </div>
  );
};

export default ImageGenerate;
