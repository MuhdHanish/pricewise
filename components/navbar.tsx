import Image from "next/image";
import Link from "next/link";

const navIcons = [
    {
        src: `/assets/icons/search.svg`,
        alt: `search-icon`
    },
    {
        src: `/assets/icons/black-heart.svg`,
        alt: `heart-icon`
    },
    {
        src: `/assets/icons/user.svg`,
        alt: `user-icon`
    },
]

export const NavBar = () => {
    return (
        <header className="w-full">
            <nav className="nav">
                <Link href={`/`} className="flex items-center gap-1">
                    <Image
                        src={`/assets/icons/logo.svg`}
                        alt="logo"
                        width={27}
                        height={27}
                    />
                    <p className="nav-logo">
                        Price<span className="text-primary">Wise</span>
                    </p>
                </Link>
                <div className="flex items-center gap-5">
                    {navIcons?.map((icon, index) => (
                        <Image
                            key={`${icon?.src}-${icon?.alt}-${index}`}
                            src={icon?.src}
                            alt={icon?.alt}
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    ))}
                </div>
            </nav>
        </header>
    );
};
