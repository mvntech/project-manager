import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) =>
        ipcRenderer.on(channel, (_, ...args) => callback(...args))
});
