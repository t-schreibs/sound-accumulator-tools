import { LinkModal } from 'linkModal';
import { App, Plugin, PluginSettingTab, Setting, getLinkpath } from 'obsidian';
import { WelcomeModal } from 'welcomeModal';

interface SoundAccumulatorPluginSettings {
	renderInfoTable: boolean;
	infoTableReplacementText: string;
	welcomeScreen: boolean;
}

const DEFAULT_SETTINGS: SoundAccumulatorPluginSettings = {
	renderInfoTable: true,
	infoTableReplacementText: '${infoTable}',
	welcomeScreen: true
}

export default class SoundAccumulatorPlugin extends Plugin {
	settings: SoundAccumulatorPluginSettings;

	async onload() {
		await this.loadSettings();
		if (this.settings.welcomeScreen) {
			new WelcomeModal(this.app).open();
			this.settings.welcomeScreen = false;
			await this.saveSettings();
		}

		// Render info tables on preview
		this.registerMarkdownPostProcessor((element, context) => {
			if (this.settings.renderInfoTable && context.frontmatter.table) {
				const paragraphs = element.querySelectorAll("p");
				paragraphs.forEach(
					paragraph => {
						if (paragraph.innerText.trim() == this.settings.infoTableReplacementText) {
							const table = element.createEl('table');
							Object.keys(context.frontmatter.table).forEach(
								key => {
									const row = table.createEl('tr');
									const name = row.createEl('td');
									name.appendText(key);
									const value = row.createEl('td');
									value.appendText(context.frontmatter.table[key]);
								}
							)
							paragraph.replaceWith(table);
						}
					}
				)
			}
		});
		// Open link modal
		this.addCommand({
			id: 'insert-link',
			name: 'Insert link',
			callback: () => {
				new LinkModal(this.app).open();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SoundAccumulatorSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SoundAccumulatorSettingTab extends PluginSettingTab {
	plugin: SoundAccumulatorPlugin;

	constructor(app: App, plugin: SoundAccumulatorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Render info table')
			.setDesc('Render the info table in the body of a post when in Preview mode')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.renderInfoTable)
				.onChange(async (value) => {
					this.plugin.settings.renderInfoTable = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Info table replacement text')
			.setDesc('The text to be replaced by the info table in Preview mode')
			.addText(text => text
				.setValue(this.plugin.settings.infoTableReplacementText)
				.onChange(async (value) => {
					this.plugin.settings.infoTableReplacementText = value;
					await this.plugin.saveSettings();
				}));
	}
}
