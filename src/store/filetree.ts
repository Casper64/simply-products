import axios from "axios";
import { action, makeAutoObservable } from "mobx"
import { Document } from "~/models/Document";
import { ModelHandler } from ".";
// import { any } from "../filedb";

export interface ContextMenuCallback {
    (options: ContextMenuOptions): void
}
export interface FileTreeStoreConstructorOptions {
    contextMenuCallback: ContextMenuCallback
}
export interface ContextMenuOptions {
    open: boolean;
    document?: Document;
    style: {
        left: string;
        top: string;
    };
    rename: boolean;
}

export class FileTreeStore {
    public documents = new  ModelHandler<Document>();
    public contextMenu: ContextMenuOptions = {
        open: false,
        style: {
            left: "0px",
            top: "0px"
        },
        rename: false
    };
    public isLoading: boolean;
    public selected: Document | null = null;
    public lineObj = {
        line: -1,  /* -1 = top, -2 = bottom */
        src: 0 /* 0 = editor, 1 = previewer */
    };

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
    public setLoading(val: boolean) {
        this.isLoading = val;
    }
    
    @action
    public setSelected(val = null as null | Document) {
        this.selected = val;
    }
    @action 
    public setLine(lineObj: any) {
        this.lineObj = lineObj;
    }

    @action
    public setCode(code: string) {
        if (this.selected) {
            this.selected.code = code;
        }
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

    @action
    public save() {
        for (const doc of this.documents.models) {
            if (doc.changed) {
                doc.changed = false;
                axios.put(`/api/documents/${doc._id}`, doc)
            }
        }
    }
}