import React from "react";
import SubtitleBlock from "./SubtitleBlock";
import { SubData } from "../types";
import useSubtitleData from "../hooks/useSubtitleData";

interface SubtitleManagerProps {
	subtitleData: SubData[];
}

const SubtitleManager: React.FC<SubtitleManagerProps> = ({ subtitleData }) => {
	const {
		updatedSubtitleData,
		changesHistory,
		handleContentChange,
		handleTimingChange,
		downloadSubtitles,
		deleteSubtitleBlock,
		addSubtitleBlocksAfter,
		addSubtitleBlockBefore,
	} = useSubtitleData(subtitleData);

	return (
		<section className="grid grid-cols-2 gap-4 w-full h-full">
			<div className="col-span-2 h-16 flex justify-center items-center">
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={downloadSubtitles}
				>
					Download Updated Subtitles
				</button>
			</div>
			{/* Sub */}
			<div className="row-start-2 px-4 overflow-auto">
				{updatedSubtitleData &&
					updatedSubtitleData.map((subtitle, index) => (
						<SubtitleBlock
							key={index}
							index={index}
							subtitle={subtitle}
							onContentChange={handleContentChange}
							onTimingChange={handleTimingChange}
							onDelete={deleteSubtitleBlock}
							onAddAfter={addSubtitleBlocksAfter} // Updated function
							onAddBefore={addSubtitleBlockBefore}
						/>
					))}
			</div>
			{/* History */}
			<div className="row-start-2 p-4 border-2 border-white overflow-auto">
				<h2 className="text-2xl font-semibold mb-4">Changes</h2>
				<ul>
					{changesHistory &&
						changesHistory.map((change, index) => (
							<li key={index} className="mb-2">
								Block {change.index + 1}:{" "}
								{change.field === "deleted"
									? `Deleted (was ${JSON.parse(change.oldValue).content})`
									: `${change.field} changed from "${change.oldValue}" to "${change.newValue}"`}
							</li>
						))}
				</ul>
			</div>
		</section>
	);
};

export default SubtitleManager;
