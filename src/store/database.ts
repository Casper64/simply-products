import { action, makeAutoObservable, computed, observable } from "mobx"
import { Category } from "models/Category";
import { Project } from "models/Project";
import { Document } from "mongoose"


export class ModelHandler<T extends Document> {
    @observable
    public models: T[]

    constructor(state?: T | T[]) {
        makeAutoObservable(this);

        if (state === undefined) {
            this.models = [];
        }
        else if (Array.isArray(state)) {
            this.models = [...state]
        }
        else {
            this.models = [state];
        }
    }

    @action
    public setModels(payload: T[]) {
        this.models = payload;
    }
    @action 
    addModel(payload: T) {
        this.models.push(payload);
    }
    @action 
    updateModel(payload: T) {
        let index = this.models.findIndex(c => c.id === payload.id);
        this.models.splice(index, 1, payload);
    }
    @action 
    deleteModel(payload: T) {
        let index = this.models.findIndex(c => c.id === payload.id);
        this.models.splice(index, 1);
    }
}


export class DatabaseStore {
    public categories = new ModelHandler<Category>();
    public projects = new ModelHandler<Project>();

    constructor() {
        makeAutoObservable(this);
    }
}