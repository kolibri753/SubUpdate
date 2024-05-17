import React, { useState, ChangeEvent } from "react";
import { parseSubtitleFile } from "../utils/SubtitleParser";
import { SubData } from "../types";

interface SubtitleUploaderProps {
  onUpload: (subtitleData: SubData[]) => void;
}

const SubtitleUploader: React.FC<SubtitleUploaderProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const content = event.target.result as string;
          const subtitleBlocks = parseSubtitleFile(content);
          onUpload(subtitleBlocks);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold mb-8">Upload Subtitle File</h1>
			<div className="flex items-center	gap-4">
				<input
					type="file"
					accept=".srt, .vtt"
					onChange={handleFileChange}
					className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
				/>
				<button
					onClick={handleUpload}
					disabled={!selectedFile}
					className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					Upload
				</button>
			</div>
    </>
  );
};

export default SubtitleUploader;
