export interface SubData {
	order: string;
	timing: string;
	content: string;
}

export interface Change {
	index: number;
	field: string;
	oldValue: string;
	newValue: string;
	blockInfo?: string; 
}