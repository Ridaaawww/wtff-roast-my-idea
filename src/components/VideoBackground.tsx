import { useEffect, useRef, useCallback } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekPendingRef = useRef(false)

  // Perform the actual seek and mark as pending
  const doSeek = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    seekPendingRef.current = true
    video.currentTime = targetTimeRef.current
  }, [])

  // When seek completes, drain the queue: if targetTime moved while
  // we were seeking, issue one more seek to catch up.
  const handleSeeked = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    seekPendingRef.current = false
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.001) {
      doSeek()
    }
  }, [doSeek])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const video = videoRef.current
      if (!video || !video.duration) return

      // Skip the very first event to establish a baseline without a jump
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX
        return
      }

      const delta = e.clientX - prevXRef.current
      prevXRef.current = e.clientX

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + offset),
      )

      // Only initiate a new seek when no seek is already in flight
      if (!seekPendingRef.current) {
        doSeek()
      }
    },
    [doSeek],
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover z-0"
      style={{ objectPosition: '70% center' }}
      src={VIDEO_URL}
      muted
      playsInline
      preload="auto"
      onSeeked={handleSeeked}
    />
  )
}
