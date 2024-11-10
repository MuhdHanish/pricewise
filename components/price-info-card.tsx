import Image from "next/image";

export const PriceInfoCard = ({
    title,
    iconSrc,
    value,
}: {
    title: string;
    iconSrc: string;
    value: string;
}) => {
    return (
        <div className={`price-info_card`}>
            <p className="text-base text-black-100">{title}</p>
            <div className="flex gap-1">
                <Image
                    src={iconSrc}
                    alt={`${title}-icon`}
                    width={24}
                    height={24}
                />
                <p className="text-xl font-bold text-secondary">{value}</p>
            </div>
        </div>
    );
};
