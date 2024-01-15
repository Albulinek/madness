// src/components/EventSystem.tsx
export class EventSystem {
    private listeners: { [key: string]: Array<(data: any) => void> } = {};

    public subscribe(eventType: string, callback: (data: any) => void) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    public publish(eventType: string, data: any) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(data));
        }
    }
}