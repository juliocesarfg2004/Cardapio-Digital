import { menu } from "../data/menu";

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
  return (
    <section className="py-12" key={category.id}>
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
              className="border border-[#f2f2f2] rounded-lg shadow-sm hover:shadow-md transition min-h-35"
            >
              <div className="flex items-center justify-between p-6 h-full">
                <div className="space-y-2 max-w-[60%]">
                  <h4 className="text-gray-800 font-semibold text-lg">
                    {item.name}
                  </h4>

                  <p className="text-gray-600 text-sm">{item.description}</p>

                  <span className="text-green-500 font-bold text-lg">
                    R$ {item.price.value.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="w-28 h-28 shrink-0">
                  <img
                    src={item.image.url}
                    alt={item.image.alt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
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
