import '../styles/globals.css'
import { createContext, useState } from 'react'
import { ChakraProvider, useDisclosure } from '@chakra-ui/react'

export const GlobalState = createContext()

function MyApp({ Component, pageProps }) {
  const [authenticatedStaff, setAauthenticatedStaff] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const value = {
    authenticatedStaff, 
    setAauthenticatedStaff,
    isOpen, 
    onOpen, 
    onClose
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
