import { Camera } from "../../camera/Camera";
import { Object3D } from "../object3D";
import { DEG2RAD, wrapAngle } from "../../constants/math";
import { Vector3 } from "../math/vector/vector3";
import { Vector3Type } from "../math/vector/vector.d";

export class OrbitControls {
    private _camera : Camera;
    private canvas : HTMLCanvasElement;
    private target : Object3D | null;
    private center : Object3D = new Object3D();
    private allowPan : boolean = true;
    private allowRotate : boolean = true;
    private allowZoom : boolean = true;
    private isPanning : boolean = false;
    private isMoving : boolean = false;

    constructor(camera : Camera, canvas : HTMLCanvasElement, target : Object3D | null = null) {
        this._camera = camera;
        this.canvas = canvas;
        this.target = target;
        this.center.name = "Camera";
        this.center.add(this._camera);

        // Binding to mouse event
        this.canvas.addEventListener('mousedown',this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup',this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove',this.onMouseMove.bind(this));
        this.canvas.addEventListener('wheel',this.onMouseWheel.bind(this));

    }

    
    public set camera(v : Camera) {
        this._camera = v;
        this.center.add(this._camera);
    }
    

    private onMouseDown(event: MouseEvent) {
        if(event.shiftKey){
            this.isPanning = true;
        }else{
            this.isMoving = true;
        }
    }

    private onMouseUp(){
        this.isMoving = false;
        this.isPanning = false;
    }

    private onMouseMove(event : MouseEvent){
        const dx = event.movementX
        const dy = event.movementY;

        if(this.isMoving && this.allowRotate){
            const row : Vector3Type = [
                wrapAngle(this.center.rotation.x - dy),
                wrapAngle(this.center.rotation.y - dx),
                0,
            ]
            const rotation = new Vector3();
            rotation.coords = row;
            rotation.x = row[0];
            rotation.y = row[1];
            rotation.z = row[2];
            this.center.rotation = rotation;
            
        }else if(this.isPanning && this.allowPan){
            this.center.position.x -= dx;
            this.center.position.y += dy;
        }

    }

    private onMouseWheel(event: WheelEvent){
        if (!this.allowZoom) return;
        const delta = event.deltaY;
        this.camera.zoom += delta;
    }

    public setDistance(delta: number){
        console.log(this._camera.name);
        console.log(delta);
        if(this._camera.name === 'perspective camera'){
            console.log("yes")
        }else{
            this._camera.zoom += delta;
        }
    }

    public update() {
        if (this.target){
            this.center.position = this.target.position;
        }
        this.center.computeLocalMatrix();
    }

    public destroy(){
        // remove listener to mouse event
        this.canvas.removeEventListener('mousedown',this.onMouseDown);
        this.canvas.removeEventListener('mouseup',this.onMouseUp);
        this.canvas.removeEventListener('mousemove',this.onMouseMove);
        this.canvas.removeEventListener('wheel',this.onMouseWheel);
    }

}