import React, { useId } from 'react'
import { useLanguage } from '../context/LanguageContext'
import '../styles/LanguageSwitcher.css'

function LanguageSwitcher({ className = '', showHelp = true }) {
  const id = useId()
  const { locale, setLocale, t, supportedLocales } = useLanguage()
  const helpId = `${id}-help`

  return (
    <div className={`sia-langSwitch ${className}`.trim()}>
      <label className="sia-langSwitch__label" htmlFor={id}>
        {t('settings.language')}
      </label>
      <select
        id={id}
        className="sia-langSwitch__select form-select form-select-sm"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-describedby={showHelp ? helpId : undefined}
      >
        {supportedLocales.map(({ id: locId, nameKey }) => (
          <option key={locId} value={locId}>
            {t(nameKey)}
          </option>
        ))}
      </select>
      {showHelp ? (
        <p id={helpId} className="sia-langSwitch__help">
          {t('settings.languageHelp')}
        </p>
      ) : null}
    </div>
  )
}

export default LanguageSwitcher
