declare module 'eev' {
    type CallbackFunction = (data: any) => void

    export class Eev {
        constructor();
        on(names: string, fn: CallbackFunction): void;
        off(names: string, fn: CallbackFunction): void;
        emit(name: string, data?: any): void;
    }

    export default Eev
}

