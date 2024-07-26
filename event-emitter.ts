
class EventEmitter {
    // @ts-ignore
    private events: Map<string, ((...args: any[]) => any)[]> = new Map();

    public on(eventName: string, listener: (...args: any[]) => any): this {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName)!.push(listener);
        return this;
    }

    public once(eventName: string, listener: (...args: any[]) => any): this {
        const onceListener = (...arg: any[]) => {
            listener(...arg);
            this.off(eventName, onceListener);
        };
        this.on(eventName, onceListener);
        return this;
    }

    public emit(eventName:string, ...args: any[]):this {
        if (this.events.has(eventName)) {
            this.events.get(eventName)!.forEach(listener => listener(...args));
        }
        return this;
    }

    public off(eventName:string, listener: (...args: any[]) => any):this {
        if (this.events.has(eventName)) {
            this.events.set(eventName, this.events.get(eventName)!.filter(l => l !== listener));
        }
        return this;
    }

    public removeAllListeners(eventName: string):this {
        if (this.events.has(eventName)) {
            this.events.delete(eventName);
        }

        return this;
    }
}

const emitter = new EventEmitter();

emitter.once('start', (a: string) => {
    console.log('start', a);
});
emitter.once('start', (a: string) => {
    console.log('start', a);
});
const listenerEnd = (a: string) => {
    console.log('end', a);
};
emitter.on('end', listenerEnd);

emitter.emit('start', ' new app');
emitter.emit('start', ' old app');
emitter.emit('end', ' new app').off('end', listenerEnd);

emitter.emit('end', ' old app');
