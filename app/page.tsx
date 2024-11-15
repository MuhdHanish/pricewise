import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/prodcut-card";
import { SearchBar } from "@/components/searchbar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";

export default async function Home() {
  const products = await getAllProducts();
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
              Unleash the Power of{" "}
              <span>Price<span className="text-primary">Wise</span></span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      {products && products?.length > 0 &&
        <section className="trending-section">
          <h2 className="section-text">Trending</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-16 w-full justify-center">
            {products?.map((product, index) => (
              <ProductCard key={`${product?._id}-${index}`} product={product} />
            ))}
          </div>
        </section>
      }
    </>
  );
};