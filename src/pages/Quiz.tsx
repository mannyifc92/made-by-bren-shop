import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { QUIZZES } from '../data/quiz'
import { useI18n, LangToggle } from '../i18n'

type Step = number // 0 = intro, 1..N = questions, N+1 = free text, N+2 = summary

export default function QuizPage() {
  const { slug } = useParams()
  const quiz = slug ? QUIZZES[slug] : undefined
  const { t, lang } = useI18n()
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [freeText, setFreeText] = useState('')
  const [copied, setCopied] = useState(false)

  const total = quiz?.questions.length ?? 0
  const summaryStep = total + 2

  const summaryText = useMemo(() => {
    if (!quiz) return ''
    const lines: string[] = [`${quiz.title[lang]} — @madeby_bren`, '']
    quiz.questions.forEach((q, i) => {
      const picked = answers[q.id] ?? []
      const labels = picked.length
        ? q.options.filter((o) => picked.includes(o.id)).map((o) => o.label[lang]).join(', ')
        : t('quiz.skipped')
      lines.push(`${i + 1}. ${q.text[lang]}`)
      lines.push(`   → ${labels}`)
    })
    if (freeText.trim()) {
      lines.push('')
      lines.push(`${quiz.freeTextLabel[lang]}`)
      lines.push(`   → ${freeText.trim()}`)
    }
    return lines.join('\n')
  }, [quiz, answers, freeText, lang, t])

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-2xl font-black">{t('quiz.notfound')}</p>
        <Link to="/" className="btn-chunky bg-card">{t('quiz.home')}</Link>
      </div>
    )
  }

  const toggleMulti = (qid: string, oid: string) =>
    setAnswers((a) => {
      const cur = a[qid] ?? []
      return { ...a, [qid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] }
    })

  const pickSingle = (qid: string, oid: string) => {
    setAnswers((a) => ({ ...a, [qid]: [oid] }))
    window.setTimeout(() => setStep((s) => s + 1), 250)
  }

  const copyAnswers = async () => {
    try {
      await navigator.clipboard.writeText(summaryText)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = summaryText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const mailto = `mailto:mannyifc92@gmail.com?subject=${encodeURIComponent(
    `${quiz.title.en} — Bren's answers`,
  )}&body=${encodeURIComponent(summaryText)}`

  const currentQ = step >= 1 && step <= total ? quiz.questions[step - 1] : null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 max-w-3xl w-full mx-auto gap-4">
        <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          {t('quiz.home')}
        </Link>
        <LangToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 max-w-2xl w-full mx-auto">
        {/* Intro */}
        {step === 0 && (
          <div className="text-center">
            <span className="sticker bg-accent text-accent-foreground">{t('quiz.hello')}</span>
            <div className="text-6xl my-8">{quiz.emoji}</div>
            <h1 className="font-display text-4xl sm:text-5xl font-black">
              <span className="squiggle inline-block">{quiz.title[lang]}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{quiz.intro[lang]}</p>
            <button onClick={() => setStep(1)} className="btn-chunky bg-primary text-primary-foreground mt-10 text-lg">
              {t('quiz.start')}
            </button>
          </div>
        )}

        {/* Questions */}
        {currentQ && (
          <div className="w-full">
            <div className="flex items-center gap-2 justify-center mb-8">
              {quiz.questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i + 1 < step ? 'w-8 bg-secondary' : i + 1 === step ? 'w-8 bg-primary' : 'w-2.5 bg-muted'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-muted-foreground ml-2">
                {step} {t('quiz.of')} {total}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-center leading-snug">
              {currentQ.text[lang]}
            </h2>
            {currentQ.hint && (
              <p className="text-center text-sm text-muted-foreground mt-2 italic">{currentQ.hint[lang]}</p>
            )}

            <div className="mt-8 flex flex-col gap-3">
              {currentQ.options.map((o) => {
                const selected = (answers[currentQ.id] ?? []).includes(o.id)
                return (
                  <button
                    key={o.id}
                    onClick={() => (currentQ.multi ? toggleMulti(currentQ.id, o.id) : pickSingle(currentQ.id, o.id))}
                    className={`btn-chunky w-full !justify-start text-left !font-bold ${
                      selected ? 'bg-secondary text-secondary-foreground' : 'bg-card'
                    }`}
                  >
                    {currentQ.multi && <span className="mr-1">{selected ? '☑' : '☐'}</span>}
                    {o.label[lang]}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep((s) => s - 1)} className="text-sm font-bold text-muted-foreground hover:text-foreground">
                {t('quiz.back')}
              </button>
              {currentQ.multi && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-chunky bg-primary text-primary-foreground !px-5 !py-2 text-sm"
                >
                  {t('quiz.next')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Free text */}
        {step === total + 1 && (
          <div className="w-full">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-center leading-snug">
              {quiz.freeTextLabel[lang]}
            </h2>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border-2 border-foreground/60 bg-card px-4 py-3 mt-8"
            />
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep((s) => s - 1)} className="text-sm font-bold text-muted-foreground hover:text-foreground">
                {t('quiz.back')}
              </button>
              <button onClick={() => setStep((s) => s + 1)} className="btn-chunky bg-primary text-primary-foreground !px-5 !py-2 text-sm">
                {t('quiz.next')}
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        {step === summaryStep && (
          <div className="w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-3xl font-black">
              <span className="squiggle inline-block">{quiz.resultTitle[lang]}</span>
            </h2>
            <p className="mt-4 text-muted-foreground">{quiz.resultNote[lang]}</p>

            <div className="stitched rounded-3xl bg-card p-6 mt-8 text-left space-y-4">
              {quiz.questions.map((q, i) => {
                const picked = answers[q.id] ?? []
                const labels = picked.length
                  ? q.options.filter((o) => picked.includes(o.id)).map((o) => o.label[lang]).join(', ')
                  : t('quiz.skipped')
                return (
                  <div key={q.id}>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {i + 1}. {q.text[lang]}
                    </div>
                    <div className="font-bold mt-0.5">→ {labels}</div>
                  </div>
                )
              })}
              {freeText.trim() && (
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{quiz.freeTextLabel[lang]}</div>
                  <div className="font-bold mt-0.5">→ {freeText.trim()}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button onClick={copyAnswers} className={`btn-chunky ${copied ? 'bg-secondary text-secondary-foreground' : 'bg-card'}`}>
                {copied ? t('quiz.copied') : t('quiz.copy')}
              </button>
              <a href={mailto} className="btn-chunky bg-primary text-primary-foreground">
                ✉️ {t('quiz.send')}
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
