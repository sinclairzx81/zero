import { Matrix }     from '../math/index'
import { Object3D } from './object'

export class Scene extends Object3D {
    constructor() {
        super()
    }

    public kind(): string {
        return "Scene"
    }

    /** Adds an object to the scene. */
    public add(object: Object3D) {
        this.objects.push(object)
    }
}