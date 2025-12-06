import { useEffect, type RefObject } from 'react';

// Define the type for the element the ref will be attached to
type AnyClickEvent = MouseEvent | TouchEvent;

// The hook accepts a ref and a callback function
export default function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: AnyClickEvent) => void
) {
    useEffect(() => {
        const listener = (event: AnyClickEvent) => {
            // 1. Do nothing if clicking ref's element or descendant elements
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            // 2. Execute the handler (e.g., set state to false)
            handler(event);
        };

        // Attach listeners
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Cleanup: remove listeners when the component unmounts
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]); // Re-run if ref or handler changes (ensuring we always use the latest handler)
}