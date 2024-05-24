import { StateManager } from '../core/managers/state';
import { Object3D } from '../core/object3D';
import { Mesh } from '../core/mesh';

const createButton = (
    parentElement : HTMLElement, 
    text: string, 
    level: number = 0
) : { childContainer: HTMLElement; button: HTMLButtonElement } => {
    const container = document.createElement('div');
    container.style.marginLeft = `${level * 20}px`;
    container.className = 'button-container';

    const button = document.createElement('button');
    button.addEventListener('click', () => {
        // Remove selected class from all buttons
        const buttons = document.querySelectorAll('.button-container button');
        buttons.forEach((e) => {
            const btn = e as HTMLButtonElement;
            btn.classList.remove('selected');
        });
        // Add selected class to the clicked button
        button.classList.add('selected');
    });
    button.textContent = text;

    const childContainer = document.createElement('div');

    container.appendChild(button);
    container.appendChild(childContainer);
    parentElement.appendChild(container);

    return {childContainer, button};
}

export class File {
    state: StateManager;

    constructor() {
        this.state = StateManager.getInstance();

        // Get tweakpane container
        const inputContainer = document.getElementById(
        'scene-graph-container'
        );

        this.createInputFile(inputContainer!);

    }

    createInputFile(container: HTMLElement) {

    }
}