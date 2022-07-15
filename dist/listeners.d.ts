export declare type ListenerTag = HTMLElement | Element | HTMLButtonElement | HTMLDivElement;
export declare type Listener = {
    element: ListenerTag;
    type: string;
    fn: EventListenerOrEventListenerObject;
};
export declare function addListener(element: ListenerTag, fn: EventListenerOrEventListenerObject, type?: string): void;
export declare function removeListener(listenerToRemove: Listener): void;
export declare function removeAllListeners(): void;
