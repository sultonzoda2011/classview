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
    let failed = false
    let video: HTMLVideoElement | null = null
    let removeNativeMetadataListener: (() => void) | undefined

    setError(null)
    setLoading(true)

    const clearLoadTimeout = () => window.clearTimeout(loadTimeout)

    const fail = (message: string) => {
      if (cancelled || failed) return
      failed = true
      clearLoadTimeout()
      console.error('[ClassView] Stream playback failed:', message)
      setError(message)
      setLoading(false)
    }

    const finishLoading = () => {
      if (cancelled || failed) return
      clearLoadTimeout()
      setLoading(false)
    }

    const tryPlay = () => {
      if (cancelled || failed || !video || !video.paused) return
      video.play().catch((e: unknown) => {
        const name = typeof e === 'object' && e !== null && 'name' in e ? String(e.name) : ''
        // The dialog cleanup intentionally cancels pending play requests.
        if (name !== 'AbortError' && !cancelled) {
          console.warn('[ClassView] Video playback was blocked:', e)
          // Keep the video controls available; autoplay restrictions should not look like a network failure.
          finishLoading()
        }
      })
    }

    const loadTimeout = window.setTimeout(() => {
      fail('Поток не начал воспроизводиться за 20 секунд. Проверь RTSP-соединение и ошибки HLS в Console.')
    }, 20_000)

    const run = async () => {
      let src: string
      try {
        // Request the signed stream URL first. The Dialog content lives in a portal,
        // so the <video> ref may not be attached on the first effect pass.
        src = isAdminLike ? await fetchAdminStream(classRoomId).unwrap() : await fetchMyStream().unwrap()
      } catch (e) {
        fail(getErrorMessage(e))
        return
      }
      if (cancelled || failed) return

      const media = videoRef.current
      if (!media) {
        fail('Видеоплеер ещё не готов. Закрой окно потока и открой его снова.')
        return
      }
      video = media

      const url = `${STREAM_ORIGIN}${src}`
      media.muted = true
      media.removeAttribute('src')
      media.onplaying = finishLoading
      media.oncanplay = () => {
        finishLoading()
        tryPlay()
      }
      media.onloadeddata = finishLoading
      media.onerror = () => fail(`${t('streams.loadError')} (media error ${media.error?.code ?? 'unknown'})`)

      // Prefer hls.js in browsers that support Media Source Extensions.
      // Native HLS is a fallback for Safari and other browsers without MSE support.
      if (Hls.isSupported()) {
        hls = new Hls({ lowLatencyMode: false })
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!cancelled && !failed) tryPlay()
        })
        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finishLoading()
        })
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          console.error('[ClassView] HLS error:', {
            type: data.type,
            details: data.details,
            fatal: data.fatal,
            response: data.response,
          })
          if (data.fatal) fail(`${t('streams.loadError')} (${data.type}: ${data.details})`)
        })
        hls.attachMedia(media)
        hls.loadSource(url)
        return
      }

      if (media.canPlayType('application/vnd.apple.mpegurl')) {
        const onLoadedMetadata = () => tryPlay()
        media.addEventListener('loadedmetadata', onLoadedMetadata)
        removeNativeMetadataListener = () => media.removeEventListener('loadedmetadata', onLoadedMetadata)
        media.src = url
        media.load()
        return
      }

      fail(t('streams.unsupportedBrowser'))
    }

    void run()

    return () => {
      cancelled = true
      clearLoadTimeout()
      hls?.destroy()
      removeNativeMetadataListener?.()
      const media = video ?? videoRef.current
      if (media) {
        media.onplaying = null
        media.oncanplay = null
        media.onloadeddata = null
        media.onerror = null
        media.pause()
        media.removeAttribute('src')
        media.load()
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
          <video ref={videoRef} controls muted playsInline className="w-full h-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StreamVideoDialog
