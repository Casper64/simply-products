import { makeAutoObservable, observable } from "mobx"
import { Category } from "models/Category";
import { Project } from "models/Project";
import { ModelHandler } from '@/store'




export class DatabaseStore {
    public categories = new ModelHandler<Category>();
    public projects = new ModelHandler<Project>();

    constructor() {
        makeAutoObservable(this);
    }
}