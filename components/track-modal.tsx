"use client";

import { addUserEmailToProduct } from "@/lib/actions";
import { formatDateTime } from "@/lib/utils";
import { Product, User } from "@/types";
import {
    Description,
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild
} from "@headlessui/react";
import Image from "next/image";
import { FormEvent, Fragment, useState, useTransition } from "react";
import { toast } from "sonner";

export const TrackModal = ({
    product
}: {
    product: Product
}) => {
    const [loading, startLoading] = useTransition();
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        setEmail("");
        setIsOpen(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailPattern.test(email);
        if (!isValid) return;
            startLoading(async () => {
                try {
                    const userExists = product?.users?.some((user: User) => user?.email === email);
                    if (userExists) {
                        toast("Already subscribed to this product alerts.");
                        return;
                    }
                    await addUserEmailToProduct(email, product?._id as string);
                    const dateTime = formatDateTime(new Date()).dateTime;
                    toast(`Subscribed to pricing alerts.`, { description: dateTime });
                    closeModal();
                } catch (error) {
                    toast.error("Something went wrong, plesae try again.");
                }
            });
    }; 
    return (
        <>
            <button
                onClick={openModal}
                type="button"
                className="btn"
            >
                Track
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as={"div"} onClose={closeModal} className="relative z-50">
                    <div className="fixed dialog-container inset-0 flex w-screen items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <DialogPanel className="dialog-content">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <div className="p-2 border border-gray-200 rounded-10">
                                            <Image
                                                src={`/assets/icons/logo.svg`}
                                                alt="logo"
                                                width={28}
                                                height={28}
                                            />
                                        </div>
                                        <Image
                                            src={`/assets/icons/x-close.svg`}
                                            alt="close-icon"
                                            width={20}
                                            height={20}
                                            className="cursor-pointer"
                                            onClick={closeModal}
                                        />
                                    </div>
                                </div>
                                <DialogTitle className="font-bold text-xl">Stay updated with product pricing alerts right in your inbox 📩</DialogTitle>
                                <Description>Never miss a bargain again with our timely alerts!</Description>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col"
                                >
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="dialog-input_container">
                                        <Image
                                            src={`/assets/icons/mail.svg`}
                                            alt="mail-icon"
                                            width={18}
                                            height={18}
                                        />
                                        <input
                                            required
                                            autoComplete="off"
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="dialog-input"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <button
                                        disabled={loading || !email}
                                        type="submit"
                                        className="dialog-btn"
                                    >
                                        {loading ? "Submitting..." : "Track"}
                                    </button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
