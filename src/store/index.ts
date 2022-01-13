import { 
    FileTreeStore, 
    ContextMenuCallback, 
    ContextMenuOptions, 
    FileTreeStoreConstructorOptions 
} from "./filetree"
import { DatabaseStore } from "./database";

export default abstract class RootStore {
    public static fileTreeStore: FileTreeStore | null = null;
    public static databaseStore: DatabaseStore = new DatabaseStore();
}

export {
    FileTreeStore,
};
export type {
    ContextMenuCallback,
    ContextMenuOptions,
    FileTreeStoreConstructorOptions
};
