import { ToastContainer } from 'react-toastify'
import useRouteElement from './useRouteElement'
// eslint-disable-next-line import/no-unresolved
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { EvenTargetLocalStorage } from './utils/auth'
import { AppContext } from './contexts/app.context'
function App() {
  const { refetchContext } = useContext(AppContext)
  useEffect(() => {
    EvenTargetLocalStorage.addEventListener('localStorage', refetchContext)
    return () => EvenTargetLocalStorage.removeEventListener('localStorage', refetchContext)
  }, [refetchContext])
  const routeElements = useRouteElement()
  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App
