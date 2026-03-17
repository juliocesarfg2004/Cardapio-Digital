import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { CartDrawer } from './CartDrawer'

export function CartIcon() {
  const [open, setOpen] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems())
  
  return (
    <>
      <CartDrawer open={open} onOpenChange={setOpen} />
      <button
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-40"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-red-500 font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    </>
  )
}
