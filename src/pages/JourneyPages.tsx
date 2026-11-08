import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lock, Star, Loader2, X } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { journeyFor } from '../data/journeys'
import { useAuthStore } from '../store/authStore'
import { useJourneyStore, type Checkin } from '../store/journeyStore'
import { getProductById } from '../data/products'
import { now } from '../store/timeStore'
import { useCouponStore } from '../store/couponStore'
import { useNotificationStore } from '../store/notificationStore'
import { uploadCheckinPhoto } from '../lib/photos'
import { PhotoThumb } from '../components/PhotoThumb'

const date = (s: string, d: number) => {
  const x = new Date(s)
  x.setDate(x.getDate() + d)
  return x
}

export function JourneyPage() {
  const user = useAuthStore(s => s.currentUser)
  const allJourneys = useJourneyStore(s => s.journeys)
  const journeys = useMemo(
    () => allJourneys.filter(j => j.userId === user?.id),
    [allJourneys, user?.id],
  )

  if (!user || !journeys.length) {
    return (
      <main className="py-10">
        <Container>
          <section className="rounded-card bg-sky p-7">
            <p className="text-xs font-bold text-accent">EXAMPLE</p>
            <h1 className="mt-2 text-3xl font-semibold text-primary">Know what to expect, week by week</h1>
            <p className="mt-3 text-sm text-muted">A simple, private way to notice how your routine feels over time.</p>
            <div className="mt-6 flex gap-2">
              {[7, 14, 28].map(d => (
                <span key={d} className="rounded-pill bg-background px-3 py-2 text-xs">
                  Day {d} · Dryness check-in
                </span>
              ))}
            </div>
            <div className="mt-7 rounded-card border border-accent-soft bg-background p-5">
              <Lock className="text-primary" />
              <h2 className="mt-2 font-semibold">Tracking unlocks when you purchase any Bodywise product</h2>
              <Link
                to={user ? '/shop' : '/login'}
                className="mt-4 inline-block rounded-pill bg-primary px-5 py-3 text-xs font-bold text-background"
              >
                {user ? 'SHOP NOW' : 'LOG IN'}
              </Link>
            </div>
          </section>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-3xl font-semibold text-primary">Your journeys</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {journeys.map(j => {
            const p = getProductById(j.productId)!
            const c = journeyFor(j.productId)!
            return (
              <Link key={j.id} to={`/journey/${j.id}`} className="rounded-card bg-sky p-5">
                <p className="font-semibold text-primary">{p.name}</p>
                <p className="mt-2 text-sm text-muted">
                  {j.checkins.length}/{c.checkpoints.length} check-ins
                </p>
                <div className="mt-3 h-2 rounded-pill bg-background">
                  <div
                    className="h-full rounded-pill bg-accent"
                    style={{ width: `${(j.checkins.length / c.checkpoints.length) * 100}%` }}
                  />
                </div>
                <span className="mt-3 inline-block rounded-pill bg-background px-2 py-1 text-xs">{j.status}</span>
              </Link>
            )
          })}
        </div>
      </Container>
    </main>
  )
}

export function JourneyDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const user = useAuthStore(s => s.currentUser)!

  const allJourneys = useJourneyStore(s => s.journeys)
  const journey = allJourneys.find(j => j.id === id && j.userId === user.id)

  const add = useJourneyStore(s => s.addCheckin)
  const complete = useJourneyStore(s => s.markGoalAchieved)
  const abandon = useJourneyStore(s => s.abandon)
  const award = useCouponStore(s => s.award)
  const notify = useNotificationStore(s => s.add)

  const [rating, setRating] = useState(3)
  const [note, setNote] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const [viewingPhoto, setViewingPhoto] = useState<{ path?: string; demo?: string; day: number } | null>(null)

  if (!journey) return <Link to="/journey">Back to journeys</Link>

  const c = journeyFor(journey.productId)!
  const p = getProductById(journey.productId)!
  const done = journey.checkins.length
  const can = done >= Math.min(4, Math.ceil(c.checkpoints.length * 0.7))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewPhoto(String(reader.result))
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setPreviewPhoto(undefined)
    }
  }

  const check = async () => {
    setIsUploading(true)
    let photoPath: string | undefined

    if (selectedFile) {
      try {
        photoPath = await uploadCheckinPhoto(user.id, journey.id, selectedFile)
      } catch (err) {
        console.warn('Supabase photo upload bypassed or failed, falling back to local preview:', err)
      }
    }

    const currentDay = Math.max(
      1,
      Math.round((now().getTime() - new Date(journey.startedAt).getTime()) / 86400000),
    )

    add(journey.id, {
      day: currentDay,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      note: note.trim() || undefined,
      photoPath,
      demoPhotoDataUrl: previewPhoto,
      photoDataUrl: previewPhoto,
    })

    setIsUploading(false)
    setOpen(false)
    setSelectedFile(null)
    setPreviewPhoto(undefined)
    setNote('')
  }

  const finish = () => {
    complete(journey.id)
    award(user.id, {
      code: c.rewardCode,
      label: c.rewardText,
      type: 'percent',
      value: 10,
      expiresAt: new Date(now().getTime() + 2592000000).toISOString(),
      used: false,
    })
    notify({
      userId: user.id,
      type: 'reward',
      title: 'Journey complete',
      body: c.rewardText,
      link: '/checkout',
    })
  }

  // Sort check-ins by day or creation time
  const sortedCheckins = [...journey.checkins].sort((a, b) => a.day - b.day)

  return (
    <main className="py-8">
      <Container>
        <Link to="/journey" className="text-sm text-accent hover:underline">
          ← Journeys
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-primary">{p.name}</h1>

        {/* Checkpoint indicators */}
        <div className="mt-6 flex gap-2 overflow-auto pb-1">
          {c.checkpoints.map(d => {
            const hasCheckin = journey.checkins.some(x => x.day >= d)
            const isDue = now() >= date(journey.startedAt, d)
            return (
              <div
                key={d}
                className={`min-w-24 rounded-card p-3 text-xs transition-colors ${
                  hasCheckin
                    ? 'bg-accent text-background font-medium'
                    : isDue
                    ? 'bg-sky text-primary font-medium'
                    : 'border border-accent-soft text-muted'
                }`}
              >
                Day {d}
                <br />
                {hasCheckin ? 'Done' : isDue ? 'Due' : 'Upcoming'}
              </div>
            )
          })}
        </div>

        {/* Expected outcomes */}
        <section className="mt-6 rounded-card bg-sky p-5">
          <h2 className="font-semibold text-primary">Expected milestones</h2>
          {c.expectedByWeek.map(x => (
            <p key={x.week} className="mt-2 text-sm text-text">
              Week {x.week}: {x.text}
            </p>
          ))}
        </section>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="rounded-pill bg-primary px-6 py-3 text-xs font-bold text-background transition hover:opacity-90"
          >
            LOG CHECK-IN
          </button>
          {can && !journey.goalAchieved && (
            <button
              onClick={finish}
              className="rounded-pill border border-primary px-5 py-3 text-xs font-bold text-primary transition hover:bg-sky"
            >
              MARK GOAL ACHIEVED
            </button>
          )}
          <button
            onClick={() => {
              abandon(journey.id)
              nav('/journey')
            }}
            className="text-xs text-muted underline hover:text-text"
          >
            This isn’t working for me
          </button>
        </div>

        {can && !journey.goalAchieved && (
          <p className="mt-3 text-xs text-muted">
            Rewards are for completing check-ins, not for claiming a result.
          </p>
        )}

        {/* ── Check-in & Photo Timeline ── */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Photo & Progress Timeline</h2>
            <span className="text-sm text-muted">
              {journey.checkins.length} {journey.checkins.length === 1 ? 'check-in' : 'check-ins'}
            </span>
          </div>

          {sortedCheckins.length === 0 ? (
            <div className="mt-4 rounded-card border border-dashed border-accent-soft p-8 text-center text-sm text-muted">
              No check-ins logged yet. Log your first check-in and photo to track changes over time!
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sortedCheckins.map((checkin: Checkin) => {
                const photoSrc = checkin.photoPath || checkin.demoPhotoDataUrl || checkin.photoDataUrl
                return (
                  <div
                    key={checkin.id}
                    className="flex flex-col rounded-card border border-accent-soft/70 bg-background p-3 shadow-xs"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-sky">
                      {photoSrc ? (
                        <PhotoThumb
                          path={checkin.photoPath}
                          demo={checkin.demoPhotoDataUrl || checkin.photoDataUrl}
                          onClick={() =>
                            setViewingPhoto({
                              path: checkin.photoPath,
                              demo: checkin.demoPhotoDataUrl || checkin.photoDataUrl,
                              day: checkin.day,
                            })
                          }
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-muted">
                          No photo added
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">Day {checkin.day}</span>
                      <div className="flex items-center gap-0.5 text-accent">
                        <Star size={12} fill="currentColor" />
                        <span>{checkin.rating}/5</span>
                      </div>
                    </div>
                    {checkin.note && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted" title={checkin.note}>
                        “{checkin.note}”
                      </p>
                    )}
                    <span className="mt-2 text-[10px] text-muted">
                      {new Date(checkin.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Photo Lightbox Modal ── */}
        {viewingPhoto && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/70 p-4"
            onClick={() => setViewingPhoto(null)}
          >
            <div
              className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-card bg-background p-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-primary">Day {viewingPhoto.day} Check-in Photo</span>
                <button
                  onClick={() => setViewingPhoto(null)}
                  className="rounded-full p-1 text-muted hover:bg-sky"
                  aria-label="Close photo"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-hidden rounded-md">
                <PhotoThumb path={viewingPhoto.path} demo={viewingPhoto.demo} />
              </div>
            </div>
          </div>
        )}

        {/* ── Log Check-in Modal ── */}
        {open && (
          <div className="fixed inset-0 z-[80] grid place-items-center bg-primary/35 p-4">
            <div className="w-full max-w-md rounded-card bg-background p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-primary">How does it feel today?</h2>
                <button onClick={() => setOpen(false)} aria-label="Close modal">
                  <X size={18} className="text-muted" />
                </button>
              </div>

              <div className="mt-4 flex justify-between">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`rounded-full p-3 transition ${
                      rating === n ? 'bg-primary text-background' : 'bg-sky hover:bg-accent-soft'
                    }`}
                  >
                    <Star size={18} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-muted">{c.scaleLabels[rating as 1 | 3 | 5] ?? ''}</p>

              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optional note (e.g. skin feels less dry, slight tingling)"
                className="mt-4 w-full rounded-card border border-accent-soft p-2.5 text-sm outline-none focus:border-accent"
                rows={3}
              />

              <div className="mt-3">
                <label className="block text-xs font-medium text-primary">Add a progress photo</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="mt-1 block w-full text-xs text-muted file:mr-3 file:rounded-pill file:border-0 file:bg-sky file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-accent-soft"
                  onChange={handleFileChange}
                />
              </div>

              {previewPhoto && (
                <div className="mt-3 flex items-center gap-3 rounded-card bg-sky p-2">
                  <img
                    src={previewPhoto}
                    alt="Preview"
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1 text-xs text-muted">
                    <p className="truncate font-medium text-primary">{selectedFile?.name ?? 'Photo ready'}</p>
                    <p>Will be saved to your timeline</p>
                  </div>
                </div>
              )}

              <div className="mt-3 rounded-card border border-dashed border-accent-soft p-3 text-xs text-muted">
                Photo guide: {c.photoGuide}
              </div>

              <button
                disabled={isUploading}
                onClick={check}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-primary px-5 py-3 text-xs font-bold text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {isUploading && <Loader2 size={14} className="animate-spin" />}
                {isUploading ? 'SAVING CHECK-IN & UPLOADING…' : 'SAVE CHECK-IN'}
              </button>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}
