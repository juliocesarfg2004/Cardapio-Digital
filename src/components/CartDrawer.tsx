import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore, type CartItem } from '../store/cartStore'

interface CartDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CartDrawer({ open: externalOpen, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const totalPrice = useCartStore((state) => state.totalPrice())
  
  const isOpen = externalOpen ?? false
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
  }

  return (
    <>
      <button
        id="cart-drawer-trigger"
        className="hidden"
        onClick={() => handleOpenChange(true)}
      />
      
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => handleOpenChange(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Seu Carrinho</h2>
                <button
                  onClick={() => handleOpenChange(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>Seu carrinho está vazio</p>
                    <p className="text-sm mt-2">Adicione itens para fazer seu pedido</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item: CartItem) => (
                      <li key={item.id} className="flex gap-4 p-3 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.observation && (
                            <p className="text-sm text-gray-500 italic mt-1 whitespace-pre-wrap break-words max-w-[180px]">
                              Obs: {item.observation}
                            </p>
                          )}
                          <p className="text-green-500 font-bold">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-green-500">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition">
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
