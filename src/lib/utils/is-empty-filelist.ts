export function isEmptyFileList(fileList: FileList | null): boolean {
	return fileList == null || fileList.length === 0;
}
