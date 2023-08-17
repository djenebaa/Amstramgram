import { Transition } from "@headlessui/react";

const TransitionComponent = ({ show, message, variant }) => {
    const textSize = variant === "delete" ? "text-2xl text-gray-800" : "text-sm";
    return (
        <Transition
            show={show}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
        >
             <p className={`${textSize} text-gray-600`}>{message}</p>
        </Transition>
    );
};

export default TransitionComponent;
