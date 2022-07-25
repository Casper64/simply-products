
/**
 * 
 * @returns whether the current user is on a mobile device
 */
export function useMobile(): boolean {
    if (process.server) return false
  return window.innerWidth < 760;
}