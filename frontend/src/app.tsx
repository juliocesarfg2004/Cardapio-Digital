import { Cards } from './components/Cards.tsx'
import { Header } from './components/Header.tsx'
import { CartIcon } from './components/CartIcon.tsx'
import { Footer } from './components/Footer.tsx'
import { Toaster } from 'sonner'

export function App() {
  return (
    <>
    <Header />
    <Cards />
    <Footer />
    <CartIcon />
    <Toaster position="top-right" />
    </>
  )
}