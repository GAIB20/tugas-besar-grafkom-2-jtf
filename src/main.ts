import './style.css'
import {Tweakpane} from "./components/tweakpane.ts";
import { WebGL } from './core/webgl.ts';
import { Scene } from './core/scene.ts';

new Tweakpane();

document.addEventListener('DOMContentLoaded', function () {
    loadContent();
});

const loadContent = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // TODO: Initialize WebGL here
    const webGL = new WebGL(gl, canvas);
    const scene =  new Scene(webGL);

    // scene.loadGLTF("../test-data/sample.gltf");

    scene.startRender();
}