import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'
import { useLanguage } from '../context/LanguageContext'

const USER_KEY = 'sia.user'

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
    }
  } catch {
    return null
  }
}

function SignIn() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { tier, setTier } = useAccessTier()
  const existing = useMemo(() => readUser(), [])
  const [name, setName] = useState(existing?.name ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')
  const [plan, setPlan] = useState(tier)

  function onSubmit(e) {
    e.preventDefault()
    try {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          name: name.trim() || 'Yeboah Bernard',
          email: email.trim() || 'yeboahbernard@example.com',
        })
      )
    } catch {
      // ignore
    }
    setTier(plan)
    navigate('/', { replace: true })
  }

  return (
    <div className="sia-page">
      <h1 className="sia-page__title">Sign in</h1>
      <p className="sia-page__lead">
        Demo sign-in for now (we’ll connect real auth later).
      </p>

      <section className="sia-card" aria-label="Sign in form">
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'var(--sia-text)',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'var(--sia-text)',
                }}
              />
            </label>

            <fieldset
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <legend style={{ fontWeight: 800, padding: '0 8px' }}>
                Plan
              </legend>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'free'}
                  onChange={() => setPlan('free')}
                />
                <span>Free</span>
              </label>
              <label
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <input
                  type="radio"
                  name="plan"
                  checked={plan === 'premium'}
                  onChange={() => setPlan('premium')}
                />
                <span>Premium</span>
              </label>
            </fieldset>

            <button
              type="submit"
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid var(--sia-accent-border)',
                background: 'var(--sia-accent-fill)',
                color: 'var(--sia-accent-bright)',
                fontWeight: 800,
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SignIn

