import { useState } from 'react';
import { SubData, Change } from '../types';

const useSubtitleData = (initialData: SubData[]) => {
  const [updatedSubtitleData, setUpdatedSubtitleData] = useState<SubData[]>(initialData);
  const [changesHistory, setChangesHistory] = useState<Change[]>([]);

  const handleContentChange = (index: number, newContent: string) => {
    const updatedData = [...updatedSubtitleData];
    const oldContent = updatedData[index].content;
    updatedData[index].content = newContent;
    setUpdatedSubtitleData(updatedData);
    const existingChangeIndex = changesHistory.findIndex(change => change.index === index && change.field === 'content');
    if (existingChangeIndex !== -1) {
      const updatedChangesHistory = [...changesHistory];
      if (newContent === updatedChangesHistory[existingChangeIndex].oldValue) {
        updatedChangesHistory.splice(existingChangeIndex, 1); // Remove the entry if new content matches the previous one
      } else {
        updatedChangesHistory[existingChangeIndex].newValue = newContent;
      }
      setChangesHistory(updatedChangesHistory);
    } else {
      setChangesHistory(prev => [...prev, { index, field: "content", oldValue: oldContent, newValue: newContent }]);
    }
  };

  const handleTimingChange = (index: number, newTiming: string) => {
    const updatedData = [...updatedSubtitleData];
    const oldTiming = updatedData[index].timing;
    updatedData[index].timing = newTiming;
    setUpdatedSubtitleData(updatedData);
    const existingChangeIndex = changesHistory.findIndex(change => change.index === index && change.field === 'timing');
    if (existingChangeIndex !== -1) {
      const updatedChangesHistory = [...changesHistory];
      if (newTiming === updatedChangesHistory[existingChangeIndex].oldValue) {
        updatedChangesHistory.splice(existingChangeIndex, 1);
      } else {
        updatedChangesHistory[existingChangeIndex].newValue = newTiming;
      }
      setChangesHistory(updatedChangesHistory);
    } else {
      setChangesHistory(prev => [...prev, { index, field: "timing", oldValue: oldTiming, newValue: newTiming }]);
    }
  };

  const downloadSubtitles = () => {
    const subtitlesString = updatedSubtitleData
      .map(
        (subtitle) => `${subtitle.order}\n${subtitle.timing}\n${subtitle.content}`
      )
      .join("\n\n");
    const blob = new Blob([subtitlesString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "updated_subtitles.srt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    updatedSubtitleData,
    changesHistory,
    handleContentChange,
    handleTimingChange,
    downloadSubtitles,
  };
};

export default useSubtitleData;
