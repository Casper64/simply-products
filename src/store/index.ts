import { 
    FileTreeStore, 
    ContextMenuCallback, 
    ContextMenuOptions, 
    FileTreeStoreConstructorOptions 
} from "./filetree"
import { DatabaseStore } from "./database";
import { action, makeAutoObservable, observable } from "mobx"
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
    setModels(payload: T[]) {
        this.models = payload;
    }
    @action 
    addModel(payload: T) {
        this.models.push(payload);
    }
    @action 
    updateModel(payload: T) {
        let index = this.models.findIndex(c => c._id === payload._id);
        this.models.splice(index, 1, payload);
    }
    @action 
    deleteModel(payload: T) {
        let index = this.models.findIndex(c => c._id === payload._id);
        this.models.splice(index, 1);
    }
    @action 
    deleteManyModels(payload: Partial<T>) {
        this.models = this.models.filter(m => {
            let k: keyof T
            for (k in payload) {
                if (payload[k] !== m[k]) return true
            }
            return false
        });
    }
}

class RootStore {
    public fileTreeStore: FileTreeStore;
    public databaseStore: DatabaseStore;

    constructor() {
        makeAutoObservable(this);
        this.fileTreeStore = new FileTreeStore({contextMenuCallback: () => null });
        this.databaseStore = new DatabaseStore();
    }
}
const store = new RootStore();
export default store;

export {
    FileTreeStore,
};
export type {
    ContextMenuCallback,
    ContextMenuOptions,
    FileTreeStoreConstructorOptions
};
