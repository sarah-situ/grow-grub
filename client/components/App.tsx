import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer.tsx'
import Header from './Header.tsx'
import LandingPage from '../pages/LandingPageNewUser.tsx'
import Register from '../pages/Register.tsx'
import { getUserByAuth } from '../apis/growGrub.ts'



function App() {
  const [processing, setProcessing] = useState(true)
  const [registered, setRegistered] = useState(false)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const getUser = async () => {
      setProcessing(true)
      const token = await getAccessTokenSilently()
      // console.log(token)
      try {
        const result = await getUserByAuth(token)
        if (result.id) setRegistered(true)
      } catch (error) {
        setRegistered(false)
      } finally {
        setProcessing(false)
      }
    }
    if (isAuthenticated) getUser()
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <>
      <div className="app min-w-screen min-h-screen">

        <Header registered={registered}/>

        {!isAuthenticated || processing ? (
          <LandingPage />
        ) : (
          <>
            {registered ? (
              <Outlet />
            ) : (
              <Register registered={registered} setRegistered={setRegistered} />
            )}
          </>
        )}
        <Footer />
      </div>
    </>
  )
}

export default App




//Swap this:

// {(!isAuthenticated) ?
//   <LandingPage />
// : <>{!registered ?
//       <Register registered={registered} setRegistered={setRegistered}/>
//     :
//       <Outlet />
//   }</>
// }

//For this:

// <Outlet />

//To Test things
