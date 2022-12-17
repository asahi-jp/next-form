import '../styles/globals.css'
import { createContext, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export const GlobalState = createContext()

function MyApp({ Component, pageProps }) {
  const [authenticatedStaff, setAauthenticatedStaff] = useState(null)
  const value = {
    authenticatedStaff, 
    setAauthenticatedStaff,
  }

  return (
    <GlobalState.Provider value={value}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </GlobalState.Provider>
  )
}

export default MyApp
