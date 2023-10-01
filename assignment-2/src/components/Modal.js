import React, { useEffect, useState } from "react";

const Modal = props => {
    const { title = "", children, open = false, onClose } = props;

    const [openState, setOpenState] = useState(open);

    const onShowModal = () => {
        setOpenState(open);
    }

    const onCloseModal = () => {
        setOpenState(false);
        onClose?.();
    }

    useEffect(() => {
        if (open) {
            onShowModal();
        } else {
            onCloseModal();
        }
    }, [open])

    return openState && (
        <div className={'Modal-Background'}>
            <div className={"Modal-Root"}>
                <div className={'Modal-Header'}>
                    <h1>{title}</h1>
                    <span className="close" onClick={onCloseModal}>&times;</span>
                </div>
                <div className={'Modal-Body'}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
