export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Coordinate {
  x: number;
  y: number;
  z: number;
}

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IObject3D {
  name: string;
  type: string;
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
  children: IObject3D[];
}

export interface IBoxGeometry {
  width: number;
  height: number;
  depth: number;
}

export interface IMesh extends IObject3D {
  geometry: IBoxGeometry;
}

export interface IObjectProperties {
  position?: IVector3;
  rotation?: IVector3;
  scale?: IVector3;
}

export interface IAnimation {
  [objectName: string]: IObjectProperties | undefined;
}

export interface IAnimationClip extends Array<IAnimation> {}
