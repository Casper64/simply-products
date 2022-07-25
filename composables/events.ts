
/**
 * Binds an event listener to the document and removes it when the component is unmounted.
 * @param event The event to be dispatched
 * @param callback The callback to be called when the event is dispatched
 */
export function useEventListener<K extends keyof DocumentEventMap>(event: K, callback: (this: Document, ev: DocumentEventMap[K]) => any): void {
  onMounted(() => document.addEventListener(event, callback));
  onUnmounted(() => document.removeEventListener(event, callback));
}