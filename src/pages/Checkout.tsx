import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/auth'
import { useCreateOrder } from '../hooks/useOrders'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ArrowLeft, MapPin, CreditCard, DollarSign, Loader2, CheckCircle } from 'lucide-react'

export function Checkout() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const clearCart = useCartStore((state) => state.clearCart)
  const createOrder = useCreateOrder()

  const [name, setName] = useState(user?.name || '')
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [complement, setComplement] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD' | 'CASH'>('PIX')
  const [observation, setObservation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderSuccess, setOrderSuccess] = useState(false)

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <p className="text-gray-600 text-lg">Você precisa estar logado para finalizar o pedido.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Fazer login
          </button>
        </main>
        <Footer />
      </>
    )
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <p className="text-gray-600 text-lg">Seu carrinho está vazio.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Voltar ao cardápio
          </button>
        </main>
        <Footer />
      </>
    )
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório'
    if (!neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFinishOrder = async () => {
    if (!validate()) return

    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          observation: item.observation,
        })),
        paymentMethod,
        address: `${address}, ${neighborhood}`,
        complement: complement.trim() || undefined,
        observation: observation.trim() || undefined,
      })

      clearCart()
      setOrderSuccess(true)
    } catch {
      setErrors({ general: 'Erro ao criar pedido. Tente novamente.' })
    }
  }

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
            <p className="text-gray-600 mb-6">Seu pedido foi recebido e está sendo preparado.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition"
              >
                Voltar ao cardápio
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition mb-6"
            aria-label="Voltar ao cardápio"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao cardápio
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Dados de Entrega
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && (
                    <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.neighborhood ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-invalid={!!errors.neighborhood}
                    aria-describedby={errors.neighborhood ? 'neighborhood-error' : undefined}
                  />
                  {errors.neighborhood && (
                    <p id="neighborhood-error" className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento (opcional)
                </label>
                <input
                  id="complement"
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto, bloco, referência..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="obs" className="block text-sm font-medium text-gray-700 mb-1">
                  Observação geral (opcional)
                </label>
                <input
                  id="obs"
                  type="text"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Ex: Entregar no portão 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Forma de Pagamento
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'PIX' as const, icon: DollarSign, label: 'PIX' },
                { value: 'CARD' as const, icon: CreditCard, label: 'Cartão' },
                { value: 'CASH' as const, icon: DollarSign, label: 'Dinheiro' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                    paymentMethod === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-pressed={paymentMethod === option.value}
                >
                  <option.icon className="w-6 h-6 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Pedido</h2>

            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{item.quantity}x {item.name}</span>
                    {item.observation && (
                      <p className="text-sm text-gray-500 italic">Obs: {item.observation}</p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-green-500">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button
            onClick={handleFinishOrder}
            disabled={createOrder.isPending}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition"
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Enviando pedido...
              </>
            ) : (
              'Finalizar Pedido'
            )}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
