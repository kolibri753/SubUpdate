import React from "react";
import { SubData } from "../types";

interface SubtitleBlockProps {
	index: number;
	subtitle: SubData;
	onContentChange: (index: number, newContent: string) => void;
	onTimingChange: (index: number, newTiming: string) => void;
	onDelete: (index: number) => void;
	onAddAfter: (index: number) => void;
	onAddBefore: (index: number) => void;
}

const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
	index,
	subtitle,
	onContentChange,
	onTimingChange,
	onDelete,
	onAddAfter,
	onAddBefore,
}) => {
	const handleContentChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		onContentChange(index, event.target.value);
	};

	const handleTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onTimingChange(index, event.target.value);
	};

	const handleDelete = () => {
		onDelete(index);
	};

	const handleAddAfter = () => {
		onAddAfter(index);
	};

	const handleAddBefore = () => {
		onAddBefore(index);
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
					<tr>
						<td className="border p-2 flex justify-between">
							<div>
								<button
									onClick={handleAddBefore}
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
								>
									Add Before
								</button>
								<button
									onClick={handleAddAfter}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Add After
								</button>
							</div>
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
							>
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default SubtitleBlock;
