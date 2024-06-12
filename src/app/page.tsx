"use client"

import React, { useState } from "react";
import SubtitleManager from "../components/SubtitleManager";
import SubtitleUploader from "../components/SubtitleUploader";
import { SubData } from "../types";

export default function Home() {
  const [subtitleData, setSubtitleData] = useState<SubData[] | null>(null);

  const handleUpload = (uploadedSubtitleData: SubData[]) => {
    setSubtitleData(uploadedSubtitleData);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black-500">
      {!subtitleData ? (
        <SubtitleUploader onUpload={handleUpload} />
      ) : (
        <SubtitleManager subtitleData={subtitleData} />
      )}
    </main>
  );
}
