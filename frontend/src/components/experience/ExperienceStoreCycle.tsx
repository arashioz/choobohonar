import { storeKindLabel, type Store } from "@/data/stores";

export default function ExperienceStoreCycle({ stores }: { stores: Store[] }) {
  return (
    <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
      {stores.map((store) => (
        <li key={store.id} className="min-w-0 border-t border-forest/10 pt-4">
          <p className="text-xs text-brick sm:text-sm">
            {storeKindLabel[store.kind]} · {store.city}
          </p>
          <p className="mt-2 text-pretty text-base font-light leading-7 text-forest sm:text-xl">
            {store.name}
          </p>
        </li>
      ))}
    </ul>
  );
}
