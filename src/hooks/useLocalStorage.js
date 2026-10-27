import { useState, useEffect } from 'react'

/**
 * Persists state to localStorage under the given key.
 * Reads the initial value from localStorage on first render.
 * @param {string} key
 * @param {any} initialValue
 * @returns {[any, function]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialValue : JSON.parse(raw)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore storage write errors (e.g. quota exceeded, private mode)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
