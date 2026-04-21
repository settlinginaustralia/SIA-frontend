import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const PATH_KEYS = {
  'study-pathway': 'paths.study',
  'work-pathway': 'paths.work',
  'skilled-migration': 'paths.skilled',
  settlement: 'paths.settlement',
}

function Pathway() {
  const { t } = useLanguage()
  const { pathId } = useParams()
  const title = useMemo(() => {
    const key = PATH_KEYS[pathId]
    return key ? t(key) : t('paths.pathwayFallback')
  }, [pathId, t])

  return (
    <div className="sia-page sia-page--wide">
      <h1 className="sia-page__title">{title}</h1>
    </div>
  )
}

export default Pathway
