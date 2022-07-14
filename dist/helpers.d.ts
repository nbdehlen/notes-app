export declare type ListenerTag = HTMLElement | Element | HTMLButtonElement | HTMLDivElement;
export declare type Listener = {
    element: ListenerTag;
    type: string;
    fn: EventListenerOrEventListenerObject;
};
export declare function addListener(store: Listener[], element: ListenerTag, fn: EventListenerOrEventListenerObject, type?: string): void;
export declare function removeListener(store: Listener[], listenerToRemove: Listener): void;
export declare function css(element: HTMLElement, style: Object): void;
