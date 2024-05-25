import { StateManager } from "../core/managers/state";

export class InputFile {
    private static instance: InputFile;
    state: StateManager;
    inputField: HTMLInputElement;

    private constructor() {
        this.state = StateManager.getInstance();
        this.inputField = document.getElementById('input-file') as HTMLInputElement;

        this.inputField.addEventListener('change', (event) => {
            this.handleFileChange(event);
        });
    }

    public static getInstance(): InputFile {
        if (!InputFile.instance) {
            InputFile.instance = new InputFile();
        }
        return InputFile.instance;
    }

    private handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const text = e.target!.result as string;
                    const fileContent = JSON.parse(text);
                    this.state.sceneManager.importObject(fileContent!);
                    this.state.emit('sceneChange', this.state.sceneManager.get());
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };

            reader.onerror = () => {
                console.error("Error reading file");
            };

            reader.readAsText(file); 
        }
        target.value = '';
    }

    public triggerFileInput() {
        this.inputField.click();
    }
}
