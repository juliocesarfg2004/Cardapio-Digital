import { useState, useMemo } from "react";
import { useCartStore } from "../store/cartStore";
import { useMenu, type MenuCategory, type MenuItem } from "../hooks/useMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

const categoryIcons: Record<string, string> = {
  hamburgers: "🍔",
  pizzas: "🍕",
  esfihas: "🥟",
  drinks: "🥤",
}

function PizzaModal({
  allPizzas,
  open,
  onOpenChange,
}: {
  allPizzas: MenuItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [firstFlavor, setFirstFlavor] = useState<MenuItem | null>(null)
  const [secondFlavor, setSecondFlavor] = useState<MenuItem | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  const selectedPrice = useMemo(() => {
    if (!firstFlavor) return 0
    if (!secondFlavor) return parseFloat(firstFlavor.price)
    return (parseFloat(firstFlavor.price) + parseFloat(secondFlavor.price)) / 2
  }, [firstFlavor, secondFlavor])

  const isWhole = !!firstFlavor && !!secondFlavor && firstFlavor.id === secondFlavor.id
  const isComplete = !!firstFlavor && !!secondFlavor

  const handleSelectFlavor = (pizza: MenuItem) => {
    if (!firstFlavor) {
      setFirstFlavor(pizza)
    } else if (!secondFlavor) {
      setSecondFlavor(pizza)
    }
  }

  const handleAddToCart = () => {
    if (!firstFlavor) return

    const pizzaType = isComplete && !isWhole ? 'half-half' : 'whole'
    const displayName = isComplete && !isWhole
      ? `${firstFlavor.name.replace('Pizza ', '')}/${secondFlavor!.name.replace('Pizza ', '')}`
      : firstFlavor.name

    addItem({
      id: `${firstFlavor.id}${secondFlavor ? '-' + secondFlavor.id : ''}`,
      name: displayName,
      price: selectedPrice,
      image: firstFlavor.image || "/placeholder.jpg",
      pizzaType,
      halfFlavor: (!isWhole && secondFlavor?.name) || undefined,
    })

    setFirstFlavor(null)
    setSecondFlavor(null)
  }

  const handleClear = () => {
    setFirstFlavor(null)
    setSecondFlavor(null)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setFirstFlavor(null)
        setSecondFlavor(null)
      }
      onOpenChange(open)
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-2">
          <img
            src={allPizzas[0]?.image || "/placeholder.jpg"}
            alt="Pizza"
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>
        <DialogHeader>
          <DialogTitle>Monte sua Pizza</DialogTitle>
          <DialogDescription>
            Selecione dois sabores. Se forem iguais, a pizza é inteira. Se diferentes, meia/meia.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg border-2 p-4 text-center transition ${
              firstFlavor
                ? 'border-green-500 bg-green-50'
                : 'border-dashed border-gray-300'
            }`}>
              <p className="text-xs text-gray-500 mb-1">1º sabor</p>
              {firstFlavor ? (
                <>
                  <p className="font-semibold text-sm">{firstFlavor.name.replace('Pizza ', '')}</p>
                  <p className="text-green-600 font-bold text-sm">
                    R$ {parseFloat(firstFlavor.price).toFixed(2).replace('.', ',')}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">Clique em um sabor</p>
              )}
            </div>

            <div className={`rounded-lg border-2 p-4 text-center transition ${
              secondFlavor
                ? isWhole
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-amber-500 bg-amber-50'
                : 'border-dashed border-gray-300'
            }`}>
              <p className="text-xs text-gray-500 mb-1">2º sabor</p>
              {secondFlavor ? (
                <>
                  <p className="font-semibold text-sm">{secondFlavor.name.replace('Pizza ', '')}</p>
                  <p className={`font-bold text-sm ${isWhole ? 'text-blue-600' : 'text-amber-600'}`}>
                    R$ {selectedPrice.toFixed(2).replace('.', ',')}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">Clique em outro sabor</p>
              )}
            </div>
          </div>

          {isComplete && (
            <div className={`rounded-lg p-3 text-sm ${
              isWhole
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}>
              <strong>🍕 {isWhole
                ? `Pizza Inteira de ${firstFlavor.name.replace('Pizza ', '')}`
                : `${firstFlavor.name.replace('Pizza ', '')} + ${secondFlavor.name.replace('Pizza ', '')} (Meia/Meia)`
              }</strong>
            </div>
          )}

          {firstFlavor && (
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAddToCart} disabled={!isComplete}>
                Adicionar ao carrinho
              </Button>
              <Button variant="outline" onClick={handleClear} className="px-3">
                Limpar
              </Button>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Escolha os sabores:</h3>
            <div className="grid grid-cols-2 gap-2">
              {allPizzas.map((pizza) => {
                const isSelectedFirst = firstFlavor?.id === pizza.id && !secondFlavor
                const isSelectedSecond = secondFlavor?.id === pizza.id
                const isDisabled = isComplete

                return (
                  <button
                    key={pizza.id}
                    onClick={() => !isDisabled && handleSelectFlavor(pizza)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border text-left transition ${
                      isSelectedFirst || isSelectedSecond
                        ? 'border-red-500 bg-red-50 ring-1 ring-red-200'
                        : isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-800">{pizza.name.replace('Pizza ', '')}</p>
                    <p className="text-xs text-gray-500 truncate">{pizza.description}</p>
                    <p className="text-green-600 font-bold text-sm mt-1">
                      R$ {parseFloat(pizza.price).toFixed(2).replace('.', ',')}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MenuSection({ category, allPizzas }: { category: MenuCategory; allPizzas: MenuItem[] }) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [observation, setObservation] = useState("")
  const [pizzaModalOpen, setPizzaModalOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: MenuItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image || "/placeholder.jpg",
      observation: observation.trim() || undefined,
    })
    setSelectedItem(null)
    setObservation("")
  }

  const isDrink = category.slug === "drinks"
  const isPizza = category.slug === "pizzas"

  if (isPizza) {
    return (
      <section id={category.slug} className="py-12" key={category.id}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-full">
            <h2 className="text-gray-800 text-xl font-bold sm:text-2xl">
              {category.name}
            </h2>
            <p className="text-gray-600 mt-1">{category.description}</p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setPizzaModalOpen(true)}
              className="w-full border border-[#f2f2f2] rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white p-8 flex flex-col items-center justify-center gap-2"
            >
              <h4 className="text-gray-800 font-semibold text-lg">Monte sua Pizza</h4>
              <p className="text-gray-600 text-sm">Escolha 2 sabores: inteira ou meia/meia</p>
              <p className="text-green-500 font-bold text-lg">
                A partir de R$ {Math.min(...allPizzas.map(p => parseFloat(p.price))).toFixed(2).replace('.', ',')}
              </p>
              <Plus className="w-8 h-8 text-red-500" />
            </button>
          </div>

          <PizzaModal
            allPizzas={allPizzas}
            open={pizzaModalOpen}
            onOpenChange={setPizzaModalOpen}
          />
        </div>
      </section>
    )
  }

  return (
    <section id={category.slug} className="py-12" key={category.id}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-full">
          <h2 className="text-gray-800 text-xl font-bold sm:text-2xl">
            {category.name}
          </h2>
          <p className="text-gray-600 mt-1">{category.description}</p>
        </div>

        <ul className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2">
          {category.items.map((item) => (
            <li
              key={item.id}
              id={`item-${item.id}`}
              className={`border border-[#f2f2f2] rounded-lg shadow-sm hover:shadow-md transition min-h-35 ${isDrink ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => {
                if (!isDrink) {
                  setSelectedItem(item)
                }
              }}
            >
              <div className="flex items-center justify-between p-6 h-full">
                <div className="space-y-2 max-w-[60%]">
                  <h4 className="text-gray-800 font-semibold text-lg">
                    {item.name}
                  </h4>

                  {!isDrink && <p className="text-gray-600 text-sm">{item.description}</p>}

                  <span className="text-green-500 font-bold text-lg">
                    R$ {parseFloat(item.price).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!isDrink && (
                    <div className="w-28 h-28 shrink-0">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {isDrink && (
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10"
                      onClick={(e) => handleAddToCart(item, e)}
                      aria-label={`Adicionar ${item.name} ao carrinho`}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {!isDrink && selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && (setSelectedItem(null), setObservation(""))}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>{selectedItem.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <img
                  src={selectedItem.image || "/placeholder.jpg"}
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-green-500 font-bold text-xl">
                  R$ {parseFloat(selectedItem.price).toFixed(2).replace(".", ",")}
                </p>
                <div className="space-y-2">
                  <label htmlFor="observation" className="text-sm font-medium text-gray-700">
                    Observação (opcional)
                  </label>
                  <input
                    id="observation"
                    type="text"
                    placeholder="Ex: Sem verdura, sem cebola, etc."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value.slice(0, 50))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-xs text-gray-400">{observation.length}/50</span>
                </div>
                <Button className="w-full" onClick={() => handleAddToCart(selectedItem)} aria-label={`Adicionar ${selectedItem.name} ao carrinho`}>Adicionar ao carrinho</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}

export function Cards() {
  const { data: menu, isLoading, error } = useMenu()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setActiveCategory(id);
  };

  const allPizzas = useMemo(() => {
    const pizzaCategory = menu?.find(c => c.slug === 'pizzas')
    return pizzaCategory?.items || []
  }, [menu])

  if (isLoading) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar cardápio. Tente novamente.</p>
      </main>
    )
  }

  const sortedMenu = [...(menu || [])].sort((a, b) => a.order - b.order)

  return (
    <main>
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex gap-2 py-3 overflow-x-auto scrollbar-hide" aria-label="Navegação por categorias">
            {sortedMenu.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.slug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                  activeCategory === category.slug
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={activeCategory === category.slug}
              >
                <span>{categoryIcons[category.slug] || "🍽️"}</span>
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {sortedMenu.map((category) => (
        <MenuSection key={category.id} category={category} allPizzas={allPizzas} />
      ))}
    </main>
  );
}
