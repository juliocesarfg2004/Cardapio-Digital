import { useState } from "react";
import { menu } from "../data/menu";
import { useCartStore } from "../store/cartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: { value: number; currency: string };
  image: { url: string; alt: string };
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  items: MenuItem[];
}

const sortedMenu = [...menu].sort((a, b) => a.order - b.order);

function MenuSection({ category }: { category: MenuCategory }) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [observation, setObservation] = useState("")
  const addItem = useCartStore((state) => state.addItem)

  const handleAddDrink = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price.value,
      image: item.image.url,
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setObservation("")
    }
    setSelectedItem(open ? selectedItem : null)
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price.value,
        image: selectedItem.image.url,
        observation: observation.trim() || undefined,
      })
      setSelectedItem(null)
      setObservation("")
    }
  }

  const isDrink = category.id === "drinks"

  return (
    <section id={category.id} className="py-12" key={category.id}>
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
              onClick={() => !isDrink && setSelectedItem(item)}
            >
              <div className="flex items-center justify-between p-6 h-full">
                <div className="space-y-2 max-w-[60%]">
                  <h4 className="text-gray-800 font-semibold text-lg">
                    {item.name}
                  </h4>

                  {!isDrink && <p className="text-gray-600 text-sm">{item.description}</p>}

                  <span className="text-green-500 font-bold text-lg">
                    R$ {item.price.value.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28 h-28 shrink-0">
                    <img
                      src={item.image.url}
                      alt={item.image.alt}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  {isDrink && (
                    <Button 
                      size="icon" 
                      className="rounded-full w-10 h-10"
                      onClick={(e) => handleAddDrink(item, e)}
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

        {!isDrink && (
          <Dialog open={!!selectedItem} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
              {selectedItem && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedItem.name}</DialogTitle>
                    <DialogDescription>{selectedItem.description}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <img
                      src={selectedItem.image.url}
                      alt={selectedItem.image.alt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-green-500 font-bold text-xl">
                      R$ {selectedItem.price.value.toFixed(2).replace(".", ",")}
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
                    <Button className="w-full" onClick={handleAddToCart} aria-label={`Adicionar ${selectedItem.name} ao carrinho`}>Adicionar ao carrinho</Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}

export function Cards() {
  return (
    <main>
      {sortedMenu.map((category) => (
        <MenuSection key={category.id} category={category} />
      ))}
    </main>
  );
}
