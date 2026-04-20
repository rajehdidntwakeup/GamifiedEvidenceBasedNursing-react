/**
 * Storage utilities for localStorage
 */

const STORAGE_PREFIX = 'ebna_'

export function localStorageSetItem(key: string, value: string): void {
  window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, value)
}

export function localStorageGetItem(key: string): string | null {
  return window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
}

export function localStorageRemoveItem(key: string): void {
  window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
}

export function localStorageClear(): void {
  window.localStorage.clear()
}
