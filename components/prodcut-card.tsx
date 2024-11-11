import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

export const ProductCard = ({
    product
}: {
    product: Product
}) => {
    return (
        <Link
            href={`/product/${product?._id}`}
            className="product-card"
        >
            <div className="product-card_img-container">
                <Image
                    src={product?.image || 'https://hryoutest.in.ua/uploads/images/default.jpg'}
                    alt={product?.title || "Product-image"}
                    width={200}
                    height={200}
                    quality={100} 
                    className="proudct-card_img"
                />
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="product-title">{product?.title}</h3>
                <div className="flex items-center justify-between text-black">
                    <span className="flex gap-1 items-center">
                        <p className="opacity-50 text-sm ">{product?.stars}</p>
                        <Image
                            src={`/assets/icons/star.svg`}
                            alt="star-icon"
                            width={15}
                            height={15}
                        />
                    </span>
                    <p className="text-base font-semibold">
                        <span>{product?.currency}</span>
                        <span>{product?.currentPrice}</span>
                    </p>
                </div>
            </div>
        </Link>
    );
};
