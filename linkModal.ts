import { FuzzySuggestModal, MarkdownEditView, MarkdownView, Notice, TFile } from "obsidian";

export class LinkModal extends FuzzySuggestModal<TFile> {
    getItems(): TFile[] {
        return this.app.vault.getFiles()
    }

    getItemText(file: TFile): string {
        return file.name;
    }

    onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent) {
        const currentFile = this.app.workspace.activeEditor?.file;
        const editor = this.app.workspace.activeEditor?.editor;
        if (editor && currentFile) {
            editor.replaceRange(
                this.app.fileManager.generateMarkdownLink(file, currentFile.path),
                editor.getCursor()
            )
        }
        this.close();
    }
}