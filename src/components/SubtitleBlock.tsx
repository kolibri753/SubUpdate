import React from "react";
import { SubData } from "../types";

interface SubtitleBlockProps {
	index: number;
	subtitle: SubData;
	onContentChange: (index: number, newContent: string) => void;
	onTimingChange: (index: number, newTiming: string) => void;
}

const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
	index,
	subtitle,
	onContentChange,
	onTimingChange,
}) => {
	const handleContentChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		onContentChange(index, event.target.value);
	};

	const handleTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onTimingChange(index, event.target.value);
	};

	return (
		<div className="mb-4">
			<table className="w-full border-collapse">
				<tbody>
					<tr>
						<td className="border p-2">
							<label className="block mb-1">Order Number</label>
							<input
								type="text"
								value={subtitle.order}
								readOnly
								className="bg-customColor1"
							/>
						</td>
					</tr>
					<tr>
						<td className="border p-2">
							<label className="block mb-1">Timing</label>
							<input
								type="text"
								value={subtitle.timing}
								onChange={handleTimingChange}
								className="w-full p-2 border rounded bg-customColor1 text-customColor2"
							/>
						</td>
					</tr>
					<tr>
						<td className="border p-2">
							<label className="block mb-1">Content</label>
							<textarea
								value={subtitle.content}
								onChange={handleContentChange}
								className="w-full p-2 border rounded bg-customColor3 text-customColor4"
								rows={3}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default SubtitleBlock;
