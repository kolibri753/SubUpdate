import React from "react";
import SubtitleBlock from "../components/SubtitleBlock";
import { SubData } from "../types";
import useSubtitleData from "../hooks/useSubtitleData";

interface SubtitleUpdatePageProps {
	subtitleData: SubData[];
}

const SubtitleUpdatePage: React.FC<SubtitleUpdatePageProps> = ({
	subtitleData,
}) => {
	const {
		updatedSubtitleData,
		changesHistory,
		handleContentChange,
		handleTimingChange,
		downloadSubtitles,
		deleteSubtitleBlock,
		restoreSubtitleBlock,
		addSubtitleBlockAfter,
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
				{updatedSubtitleData.map((subtitle, index) => (
					<SubtitleBlock
						key={index}
						index={index}
						subtitle={subtitle}
						onContentChange={handleContentChange}
						onTimingChange={handleTimingChange}
						onDelete={deleteSubtitleBlock}
						onAddAfter={addSubtitleBlockAfter}
						onAddBefore={addSubtitleBlockBefore}
					/>
				))}
			</div>
			{/* History */}
			<div className="row-start-2 px-4 border-2 border-white overflow-auto">
				<div className="mt-8">
					<h2 className="text-2xl font-semibold mb-4">Changes</h2>
					<ul>
						{changesHistory.map((change, index) => (
							<li key={index} className="mb-2">
								Block {change.index + 1}:{" "}
								{change.field === "added"
									? `added ${change.newValue.includes("after") ? "after" : "before"} ${
											change.blockInfo
									  }`
									: `${change.field} changed from "${change.oldValue}" to "${change.newValue}"`}
								{change.field === "deleted" && (
									<button
										className="ml-2 text-blue-500 hover:underline"
										onClick={() => restoreSubtitleBlock(change.index)}
									>
										Restore
									</button>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default SubtitleUpdatePage;
