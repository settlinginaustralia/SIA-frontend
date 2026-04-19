import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccessTier } from '../context/AccessTierContext'

const USER_KEY = 'sia.user'

function Logout() {
  const navigate = useNavigate()
  const { setTier } = useAccessTier()

  useEffect(() => {
    try {
      localStorage.removeItem(USER_KEY)
    } catch {
      // ignore
    }
    setTier('free')
    navigate('/', { replace: true })
  }, [navigate, setTier])

  return null
}

export default Logout

