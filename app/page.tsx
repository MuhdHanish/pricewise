import { HeroCarousel } from "@/components/hero-carousel";
import { SearchBar } from "@/components/searchbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src={`/assets/icons/arrow-right.svg`}
                alt={`arrow-right-icon`}
                height={16}
                width={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> PriceWise</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {[
            { id: 1, name: "Apple Iphone 15" },
            { id: 2, name: "The Art of War" },
            { id: 3, name: "Acer Nitro" }
          ]?.map((product, index) => (
            <div key={`${product?.id}-${index}`}>{product?.name}</div>
          ))}
        </div>
      </section>
    </>
  );
};