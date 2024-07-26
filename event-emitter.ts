
class EventEmitter {
    private events: Map<string, ((...args: any[]) => any)[]> = new Map();

    public on(eventName: string, listener: (...args: any[]) => any): this {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName)!.push(listener);
        return this;
    }

    public once(eventName: string, listener: (...args: any[]) => any): this {
        const onceListener = (...args: any[]) => {
            listener(...args);
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

function assert(statement: boolean, message: string) {
    if (statement) {
        console.error(message);
        throw new Error(message)
    }
}

function testOn(): void {
    const emitter = new EventEmitter();
    let called = false;
    emitter.on('test', () => {
        called = true;
    });
    emitter.emit('test');
    assert(!called, 'The on method did not register the event listener correctly.');
}

function testOnce(): void {
    const emitter = new EventEmitter();
    let callCount = 0;
    emitter.once('test', () => {
        callCount++;
    });
    emitter.emit('test');
    emitter.emit('test');
    assert(callCount !== 1, 'The once method did not unregister the listener after one call.');
}

function testEmit(): void {
    const emitter = new EventEmitter();
    let result = '';
    emitter.on('test', (msg: string) => {
        result = msg;
    });
    emitter.emit('test', 'Hello');
    assert(result !== 'Hello', 'The emit method did not pass arguments correctly to listeners.');
}

function testOff(): void {
    const emitter = new EventEmitter();
    let called = false;
    const listener = () => {
        called = true;
    };
    emitter.on('test', listener);
    emitter.off('test', listener);
    emitter.emit('test');
    assert(called, 'The off method did not remove the listener correctly.');
}

function testRemoveAllListeners(): void {
    const emitter = new EventEmitter();
    let called = false;
    emitter.on('test', () => {
        called = true;
    });
    emitter.removeAllListeners('test');
    emitter.emit('test');
    assert(called, 'The removeAllListeners method did not remove all listeners correctly.');
}

function runTests() {
    try {
        testOn();
        testOnce();
        testEmit();
        testOff();
        testRemoveAllListeners();
        console.log('All tests passed.');
    } catch (error) {
        console.error(error);
    }
}

runTests();
