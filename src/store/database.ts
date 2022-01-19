import { makeAutoObservable, observable } from "mobx"
import { Project } from "models/Project";
import { ModelHandler } from '@/store'




export class DatabaseStore {
    public projects = new ModelHandler<Project>();

    constructor() {
        makeAutoObservable(this);
    }
}