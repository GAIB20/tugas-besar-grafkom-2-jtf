import { Pane } from 'tweakpane';
import { StateManager } from '../core/managers/state';
import { BindingApi } from '@tweakpane/core';
import { Scene } from '../core/scene';
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

export class SceneGraph {
    state: StateManager;

    constructor() {
        this.state = StateManager.getInstance();

        // Get tweakpane container
        const sceneGraphContainer = document.getElementById(
        'scene-graph-container'
        );

        this.createGraph(this.state.sceneManager.get(), sceneGraphContainer!);

        this.state.on('sceneChange', (scene) => {
            while (sceneGraphContainer!.firstChild) {
                sceneGraphContainer!.removeChild(sceneGraphContainer!.firstChild);
            }
            this.createGraph(scene, sceneGraphContainer!)
        });
    }

    createGraph(parentObject3D: Object3D, container: HTMLElement, level: number = 0) {
        const object3Ds = parentObject3D.children;

        object3Ds.forEach(object3D => {
            const {childContainer, button} = createButton(container, object3D.name, level);
            button.addEventListener('click', () => {
                if(object3D instanceof Mesh) {
                    this.state.changeSelectedMesh(object3D);
                }
            });

            this.createGraph(object3D, childContainer, level+1);
        });
    }
}