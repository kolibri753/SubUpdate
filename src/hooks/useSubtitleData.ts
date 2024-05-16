import { useState } from "react";
import { SubData, Change } from "../types";

const useSubtitleData = (initialData: SubData[]) => {
	const [updatedSubtitleData, setUpdatedSubtitleData] =
		useState<SubData[]>(initialData);
	const [changesHistory, setChangesHistory] = useState<Change[]>([]);

	const handleContentChange = (index: number, newContent: string) => {
		const updatedData = [...updatedSubtitleData];
		const oldContent = updatedData[index].content;
		updatedData[index].content = newContent;
		setUpdatedSubtitleData(updatedData);
		const existingChangeIndex = changesHistory.findIndex(
			(change) => change.index === index && change.field === "content"
		);
		if (existingChangeIndex !== -1) {
			const updatedChangesHistory = [...changesHistory];
			if (newContent === updatedChangesHistory[existingChangeIndex].oldValue) {
				updatedChangesHistory.splice(existingChangeIndex, 1);
			} else {
				updatedChangesHistory[existingChangeIndex].newValue = newContent;
			}
			setChangesHistory(updatedChangesHistory);
		} else {
			setChangesHistory((prev) => [
				...prev,
				{ index, field: "content", oldValue: oldContent, newValue: newContent },
			]);
		}
	};

	const handleTimingChange = (index: number, newTiming: string) => {
		const updatedData = [...updatedSubtitleData];
		const oldTiming = updatedData[index].timing;
		updatedData[index].timing = newTiming;
		setUpdatedSubtitleData(updatedData);
		setChangesHistory((prev) => [
			...prev,
			{ index, field: "timing", oldValue: oldTiming, newValue: newTiming },
		]);
	};

	const deleteSubtitleBlock = (index: number) => {
		const deletedBlock = updatedSubtitleData[index];
		const updatedData = updatedSubtitleData.filter((_, i) => i !== index);
		setUpdatedSubtitleData(
			updatedData.map((subtitle, idx) => ({ ...subtitle, order: `${idx + 1}` }))
		);
		setChangesHistory((prev) => [
			...prev,
			{
				index,
				field: "deleted",
				oldValue: JSON.stringify(deletedBlock),
				newValue: "",
			},
		]);
	};

	const addSubtitleBlockAfter = (index: number) => {
		const newBlock: SubData = {
			order: `${index + 2}`,
			timing: "00:00:00,000 --> 00:00:00,000",
			content: "",
		};
		const updatedData = [...updatedSubtitleData];
		const currentBlockTiming = updatedData[index]?.timing;
		const nextBlockTiming = updatedData[index + 1]?.timing;

		if (currentBlockTiming && nextBlockTiming) {
			const [start] = currentBlockTiming.split(" --> ").slice(-1);;
			const [end] = nextBlockTiming.split(" --> ");
			newBlock.timing = `${start} --> ${end}`;
		}

		updatedData.splice(index + 1, 0, newBlock);
		setUpdatedSubtitleData(
			updatedData.map((subtitle, idx) => ({ ...subtitle, order: `${idx + 1}` }))
		);
		const blockAfterIndex =
			index + 1 < updatedSubtitleData.length ? index + 1 : index;
		const blockAfterInfo = `Block ${blockAfterIndex + 1}`;
		setChangesHistory((prev) => [
			...prev,
			{
				index: index + 1,
				field: "added",
				oldValue: "",
				newValue: JSON.stringify(newBlock),
				blockInfo: blockAfterInfo,
			},
		]);
	};

	const addSubtitleBlockBefore = (index: number) => {
		const newBlock: SubData = {
			order: `${index + 1}`,
			timing: "",
			content: "",
		};
		const updatedData = [...updatedSubtitleData];
		const previousBlockTiming = updatedData[index - 1]?.timing;
		const currentBlockTiming = updatedData[index]?.timing;

		if (previousBlockTiming && currentBlockTiming) {
			const [start] = previousBlockTiming.split(" --> ").slice(-1);;
			const [end] = currentBlockTiming.split(" --> ");
			newBlock.timing = `${start} --> ${end}`;
		}

		updatedData.splice(index, 0, newBlock);
		setUpdatedSubtitleData(
			updatedData.map((subtitle, idx) => ({ ...subtitle, order: `${idx + 1}` }))
		);
		const blockBeforeIndex = index > 0 ? index - 1 : index;
		const blockBeforeInfo = `Block ${blockBeforeIndex + 1}`;
		setChangesHistory((prev) => [
			...prev,
			{
				index,
				field: "added",
				oldValue: "",
				newValue: JSON.stringify(newBlock),
				blockInfo: blockBeforeInfo,
			},
		]);
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
		deleteSubtitleBlock,
		addSubtitleBlockAfter,
		addSubtitleBlockBefore,
		downloadSubtitles,
	};
};

export default useSubtitleData;
