import { App, Modal } from "obsidian";

export class WelcomeModal extends Modal {

  constructor(app: App) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText('Welcome to the Sound Accumulator Obsidian plugin!');
    this.createForm();
  }

  async onClose() {
    this.contentEl.empty();
  }

  async createForm() {
    this.contentEl.createEl('p', 
    { 
        text: 'This plugin was built to make working with the Sound Accumulator repository a much nicer experience. ' +
        'As it is very much a work in progress, you can expect to see additional niceties make their way into your ' + 
        'Obsidian vault as newer versions are released.'
    });
    this.contentEl.createEl('p', 
    {
        text: 'Current features:'
    })
    const ul = this.contentEl.createEl('ul');
    ul.createEl('li', {
        text: 'Frontmatter info tables are rendered in the bodies of posts when in Preview mode'
    });
    ul.createEl('li', {
        text: 'Frontmatter track and release lists are rendered at the bottom of posts when in Preview mode'
    });
    ul.createEl('li', {
        text: '"Insert link" command allows for quick, smart insertion of markdown links in both frontmatter and body text'
    });
  }
}