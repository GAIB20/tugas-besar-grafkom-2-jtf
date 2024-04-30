import './style.css'
import {Tweakpane} from "./components/tweakpane.ts";

const tweakpane = new Tweakpane();

document.addEventListener('DOMContentLoaded', function () {
    loadContent();
});

const loadContent = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // TODO: Initialize WebGL here
}