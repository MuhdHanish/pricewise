import { PriceInfoCard } from "@/components/price-info-card";
import { ProductCard } from "@/components/prodcut-card";
import { TrackModal } from "@/components/track-modal";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber, truncateText } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) redirect(`/`);
    const products = await getSimilarProducts(id);
    return (
        <div className="product-container">
            <div className="flex gap-28 flex-col xl:flex-row">
                <div className="product-image my-auto">
                    <Image
                        src={product?.image || 'https://hryoutest.in.ua/uploads/images/default.jpg'}
                        alt={product?.title || "Product-image"}
                        width={400}
                        height={400}
                        quality={100}
                        className="mx-auto h-fit object-contain"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] text-secondary font-semibold">
                                {product?.title}
                            </p>
                            <Link
                                href={product?.url}
                                target="_blank"
                                className="text-base text-black opacity-50"
                            >
                                View Product
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="product-hearts">
                                <Image
                                    src={`/assets/icons/red-heart.svg`}
                                    alt="red-heart-icon"
                                    width={20}
                                    height={20}
                                />
                                <p className="text-base font-semibold text-[#D46F77]">
                                    {product?.reviewsCount}
                                </p>
                            </div>
                            <div className="p-2 bg-white-200 rounded-10">
                                <Image
                                    src={`/assets/icons/bookmark.svg`}
                                    alt="bookmark-icon"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div className="p-2 bg-white-200 rounded-10">
                                <Image
                                    src={`/assets/icons/share.svg`}
                                    alt="share-icon"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="product-info">
                        <div className="flex flex-col gap-2 text-secondary font-bold">
                            <p className="text-[28px]">{product?.currency} {formatNumber(product?.currentPrice)}</p>
                            <p className="text-[20px] opacity-50 line-through">{product?.currency} {formatNumber(product?.originalPrice)}</p>
                        </div>
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex gap-3 font-semibold">
                                <div className="product-stars">
                                    <Image
                                        src={`/assets/icons/star.svg`}
                                        alt="star-icon"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-primary-orange">
                                        {product?.stars}
                                    </p>
                                </div>
                                <div className="product-reviews">
                                    <Image
                                        src={`/assets/icons/comment.svg`}
                                        alt="comment-icon"
                                        width={16}
                                        height={16}
                                    />
                                    <p className="text-secondary">{product?.reviewsCount} Reviews</p>
                                </div>
                            </div>
                            {(product?.stars > 0 || product?.reviewsCount > 0) &&
                                <p className="text-black opacity-50">
                                    <span className="text-primary-green">{Math.floor(Math.random() * (98 - 91 + 1)) + 91}%</span>{" "}
                                    of buyers have recommended this.
                                </p>
                            }
                        </div>
                    </div>
                    <div className="my-7 flex flex-col gap-5">
                        <div className="flex gap-5 flex-wrap">
                            <PriceInfoCard
                                title={"Current Price"}
                                iconSrc={"/assets/icons/price-tag.svg"}
                                value={`${product?.currency} ${formatNumber(product?.currentPrice)}`}
                            />
                            <PriceInfoCard
                                title={"Average Price"}
                                iconSrc={"/assets/icons/chart.svg"}
                                value={`${product?.currency} ${formatNumber(product?.averagePrice)}`}
                            />
                            <PriceInfoCard
                                title={"Highest Price"}
                                iconSrc={"/assets/icons/arrow-up.svg"}
                                value={`${product?.currency} ${formatNumber(product?.highestPrice)}`}
                            />
                            <PriceInfoCard
                                title={"Lowest Price"}
                                iconSrc={"/assets/icons/arrow-down.svg"}
                                value={`${product?.currency} ${formatNumber(product?.lowestPrice)}`}
                            />
                        </div>
                    </div>
                    <TrackModal product={product} />
                </div>
            </div>
            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-4">
                    <h3 className="text-2xl text-secondary font-semibold">Description</h3>
                    <div className="flex flex-col gap-4">
                        {truncateText(product?.description, 1000)}
                    </div>
                </div>
                <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
                    <Image
                        src={`/assets/icons/bag.svg`}
                        alt="bag-icon"
                        width={22}
                        height={22}
                    />
                    <Link
                        href={product?.url}
                        target="_blank"
                        className="text-base text-white"
                    >
                        Buy Now
                    </Link>
                </button>
            </div>
            {products && products?.length > 0 &&
                <div className="py-14 flex flex-col gap-4 w-full">
                    <p className="section-text">Similar Products</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-16 mt-7 w-full justify-center">
                        {products?.map((product, index) => (
                            <ProductCard
                                key={`${product?._id}-${index}`}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};
