import { useState, useEffect } from 'react'

interface TypewriterResult {
  displayed: string
  done: boolean
}

export function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600,
): TypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let intervalId: number | undefined
    let index = 0

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
