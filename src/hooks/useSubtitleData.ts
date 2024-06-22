import { useState } from "react";
import { SubData, Change } from "../types";

const useSubtitleData = (initialData: SubData[]) => {
	const [updatedSubtitleData, setUpdatedSubtitleData] =
		useState<SubData[]>(initialData);
	const [changesHistory, setChangesHistory] = useState<Change[]>([]);

	const updateChangesHistory = (
		index: number,
		field: string,
		oldValue: string,
		newValue: string
	) => {
		const existingChangeIndex = changesHistory.findIndex(
			(change) => change.index === index && change.field === field
		);

		if (existingChangeIndex !== -1) {
			const updatedChangesHistory = [...changesHistory];
			if (newValue === updatedChangesHistory[existingChangeIndex].oldValue) {
				updatedChangesHistory.splice(existingChangeIndex, 1);
			} else {
				updatedChangesHistory[existingChangeIndex].newValue = newValue;
			}
			setChangesHistory(updatedChangesHistory);
		} else {
			setChangesHistory((prev) => [...prev, { index, field, oldValue, newValue }]);
		}
	};

	const handleContentChange = (index: number, newContent: string) => {
		const updatedData = [...updatedSubtitleData];
		const oldContent = updatedData[index].content;
		updatedData[index].content = newContent;
		setUpdatedSubtitleData(updatedData);
		updateChangesHistory(index, "content", oldContent, newContent);
	};

	const handleTimingChange = (index: number, newTiming: string) => {
		const updatedData = [...updatedSubtitleData];
		const oldTiming = updatedData[index].timing;
		updatedData[index].timing = newTiming;
		setUpdatedSubtitleData(updatedData);
		updateChangesHistory(index, "timing", oldTiming, newTiming);
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

	const addSubtitleBlocksAfter = (index: number) => {
		const currentBlockTiming = updatedSubtitleData[index]?.timing;
		const nextBlockTiming = updatedSubtitleData[index + 1]?.timing;

		let blocksToAdd: SubData[] = [];
		if (currentBlockTiming && nextBlockTiming) {
			const [start, end] = currentBlockTiming.split(" --> ");
			let [endHour, endMin, endSec] = end.split(":").map(parseFloat);

			const [nextStart] = nextBlockTiming.split(" --> ");
			let [nextStartHour, nextStartMin, nextStartSec] = nextStart
				.split(":")
				.map(parseFloat);

			const nextStartTime =
				nextStartHour * 3600 + nextStartMin * 60 + nextStartSec;

			while (endHour * 3600 + endMin * 60 + endSec + 2 <= nextStartTime) {
				endSec += 2;
				if (endSec >= 60) {
					endMin += 1;
					endSec -= 60;
				}
				if (endMin >= 60) {
					endHour += 1;
					endMin -= 60;
				}

				const newStart = `${String(endHour).padStart(2, "0")}:${String(
					endMin
				).padStart(2, "0")}:${String(endSec - 2).padStart(2, "0")},000`;
				const newEnd = `${String(endHour).padStart(2, "0")}:${String(
					endMin
				).padStart(2, "0")}:${String(endSec).padStart(2, "0")},000`;

				const newBlock: SubData = {
					order: `${index + 2 + blocksToAdd.length}`,
					timing: `${newStart} --> ${newEnd}`,
					content: "",
				};

				blocksToAdd.push(newBlock);
			}
		}

		const updatedData = [...updatedSubtitleData];
		updatedData.splice(index + 1, 0, ...blocksToAdd);
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
				newValue: JSON.stringify(blocksToAdd),
				blockInfo: blockAfterInfo,
			},
		]);
	};

	const addSubtitleBlockBefore = (index: number) => {
		const newBlock: SubData = {
			order: `${index + 1}`,
			timing: "00:00:00,000 --> 00:00:00,000",
			content: "",
		};
		const updatedData = [...updatedSubtitleData];
		const previousBlockTiming = updatedData[index - 1]?.timing;
		const currentBlockTiming = updatedData[index]?.timing;

		if (previousBlockTiming && currentBlockTiming) {
			const [start] = previousBlockTiming.split(" --> ").slice(-1);
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
		addSubtitleBlocksAfter,
		addSubtitleBlockBefore,
		downloadSubtitles,
	};
};

export default useSubtitleData;
