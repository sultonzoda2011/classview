import Hls from 'hls.js'
import { Loader2, VideoOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../api/baseQuery'
import { useAuth } from '../../hooks/useAuth'
import { toMinutes } from '../../lib/time'
import { notify } from '../../lib/notify'
import { useLazyGetClassRoomStreamQuery, useLazyGetMyStreamQuery } from '../../store/streamsApi'
import { useGetUserByIdQuery } from '../../store/usersApi'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { STREAM_ORIGIN } from '../../api/env'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  classRoomId: number | null
  classRoomName?: string
}

/** Диалог просмотра потока: получает подписанную ссылку с бэкенда и проигрывает её через hls.js. */
const StreamVideoDialog = ({ open, onOpenChange, classRoomId, classRoomName }: Props) => {
  const { t } = useTranslation()
  const { info } = useAuth()
  const isAdminLike = info?.role === 'Admin' || info?.role === 'SuperAdmin'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [fetchAdminStream] = useLazyGetClassRoomStreamQuery()
  const [fetchMyStream] = useLazyGetMyStreamQuery()
  const { data: me } = useGetUserByIdQuery(info?.nameid ?? '', { skip: !info?.nameid || isAdminLike })

  useEffect(() => {
    if (!open || classRoomId == null) return
    let hls: Hls | null = null
    let cancelled = false
    setError(null)
    setLoading(true)

    const loadTimeout = window.setTimeout(() => {
      if (cancelled) return
      console.error('[ClassView] Stream did not become playable within 20 seconds.')
      setError(t('streams.loadError'))
      setLoading(false)
    }, 20_000)

    const finishLoading = () => {
      window.clearTimeout(loadTimeout)
      if (!cancelled) setLoading(false)
    }

    const run = async () => {
      let src: string
      try {
        src = isAdminLike ? await fetchAdminStream(classRoomId).unwrap() : await fetchMyStream().unwrap()
      } catch (e) {
        if (!cancelled) {
          window.clearTimeout(loadTimeout)
          setError(getErrorMessage(e))
          setLoading(false)
        }
        return
      }
      if (cancelled) return
      const url = `${STREAM_ORIGIN}${src}`
      const video = videoRef.current
      if (!video) return

      video.onerror = () => {
        console.error('[ClassView] Video element error:', video.error)
        if (!cancelled) {
          window.clearTimeout(loadTimeout)
          setError(t('streams.loadError'))
          setLoading(false)
        }
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.onloadedmetadata = finishLoading
        video.onloadeddata = finishLoading
        video.src = url
        video.load()
        video.play().catch((e: unknown) => console.warn('[ClassView] Native video autoplay was blocked:', e))
        return
      }
      if (!Hls.isSupported()) {
        window.clearTimeout(loadTimeout)
        setError(t('streams.unsupportedBrowser'))
        setLoading(false)
        return
      }

      hls = new Hls({ lowLatencyMode: false })
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        finishLoading()
        video.play().catch((e: unknown) => console.warn('[ClassView] HLS autoplay was blocked:', e))
      })
      hls.on(Hls.Events.FRAG_BUFFERED, finishLoading)
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        console.error('[ClassView] HLS error:', {
          type: data.type,
          details: data.details,
          fatal: data.fatal,
          response: data.response,
        })
        if (data.fatal && !cancelled) {
          window.clearTimeout(loadTimeout)
          setError(`${t('streams.loadError')} (${data.type}: ${data.details})`)
          setLoading(false)
        }
      })
      hls.attachMedia(video)
      hls.loadSource(url)
    }
    run()

    const videoEl = videoRef.current
    return () => {
      cancelled = true
      window.clearTimeout(loadTimeout)
      hls?.destroy()
      if (videoEl) {
        videoEl.onerror = null
        videoEl.onloadedmetadata = null
        videoEl.onloadeddata = null
        videoEl.pause()
        videoEl.src = ''
        videoEl.load()
      }
    }
  }, [open, classRoomId, isAdminLike, fetchAdminStream, fetchMyStream, t])

  // Родителю показываем предупреждение, когда до конца окна просмотра остаётся < 2 минут, и закрываем по истечении
  useEffect(() => {
    if (!open || isAdminLike || !me) return
    const end = toMinutes(me.endTime)
    if (end === null) return
    let warned = false
    const check = () => {
      const now = new Date()
      const current = now.getHours() * 60 + now.getMinutes()
      if (current > end) {
        onOpenChange(false)
        notify.error(t('streams.timeExpired'))
      } else if (!warned && end - current <= 2) {
        warned = true
        notify.error(t('streams.timeExpiringSoon'))
      }
    }
    check()
    const timer = setInterval(check, 30_000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAdminLike, me?.endTime])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black">
        <DialogTitle className="sr-only">{classRoomName ?? t('navigation.streams')}</DialogTitle>
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {loading && !error && <Loader2 className="h-8 w-8 animate-spin text-white/70 absolute" />}
          {error && (
            <div className="flex flex-col items-center gap-2 text-white/80 p-6 text-center">
              <VideoOff className="h-8 w-8" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <video ref={videoRef} controls autoPlay muted playsInline className="w-full h-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StreamVideoDialog
