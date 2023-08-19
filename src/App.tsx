import { ToastContainer } from 'react-toastify'
import useRouteElement from './useRouteElement'
// eslint-disable-next-line import/no-unresolved
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const routeElements = useRouteElement()
  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App
