import { action, makeAutoObservable } from "mobx"
// import { any } from "../filedb";

export interface ContextMenuCallback {
    (options: ContextMenuOptions): void
}
export interface FileTreeStoreConstructorOptions {
    contextMenuCallback: ContextMenuCallback
}
export interface ContextMenuOptions {
    open: boolean;
    document: any;
    style: {
        left: string;
        top: string;
    };
    rename: boolean;
}

export class FileTreeStore {
    public documents: any[] = [];
    public contextMenu: ContextMenuOptions = {
        open: false,
        document: null,
        style: {
            left: "0px",
            top: "0px"
        },
        rename: false
    };
    public isLoading: boolean;
    public selected: number = -1;

    private contextMenuCallbackList: ContextMenuCallback[] = [];

    constructor(opts: FileTreeStoreConstructorOptions) {
        makeAutoObservable(this)
        const {
            contextMenuCallback
        } = opts;
        this.addContextMenuCallback(contextMenuCallback);

        this.isLoading = false;
    }

    @action
    public addDocument(document: any) {
        this.documents.push(document);
    }
    @action removeDocument(document: any) {
        this.documents = this.documents.filter(d => d.getGuid() !== document.getGuid());
    }
    @action changeDocument(document: any) {
        let index = this.documents.findIndex(o => o.getGuid() === document.getGuid());
        this.documents.splice(index, 1, document);
    }

    @action
    public setDocuments(documents: any[]) {
        this.documents = documents;
    }

    @action
    public setLoading(val: boolean) {
        this.isLoading = val;
    }
    
    @action
    public setSelected(val = -1) {
        this.selected = val;
    }

    @action
    public addContextMenuCallback(callback: ContextMenuCallback) {
        let i = 0;
        for (i = 0; i < this.contextMenuCallbackList.length; i++) {
            if (this.contextMenuCallbackList[i].toString() !== callback.toString()) {
                break;
            }
        }
        if (i != 0 && i === this.contextMenuCallbackList.length) return
        this.contextMenuCallbackList.push(callback);
    }
    @action public removeContextMenuCallback(callback: ContextMenuCallback) {
        this.contextMenuCallbackList = this.contextMenuCallbackList.filter(c => c.toString() !== callback.toString());
    }

    @action setContextMenu(val: ContextMenuOptions) {
        this.contextMenu = val;
        this.contextMenuCallbackList.forEach(callback => callback(val));
    }
}