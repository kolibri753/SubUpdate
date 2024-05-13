import { SubData } from "../types";

export const parseSubtitleFile = (content: string): SubData[] => {
	const lines = content.split("\n");
	const blocks: SubData[] = [];
	let currentIndex = 0;

	while (currentIndex < lines.length) {
		// Skip empty lines
		while (lines[currentIndex]?.trim() === "") {
			currentIndex++;
		}

		// Check if there are enough lines for a subtitle block
		if (currentIndex + 2 >= lines.length) {
			break;
		}

		const order = lines[currentIndex++]?.trim();
		const timing = lines[currentIndex++]?.trim();

		// Find the end of the content
		let endIndex = currentIndex + 1;
		while (endIndex < lines.length && lines[endIndex]?.trim() !== "") {
			endIndex++;
		}

		const content = lines.slice(currentIndex, endIndex).join("\n").trim();
		currentIndex = endIndex + 1;

		blocks.push({ order, timing, content });
	}

	return blocks;
};
