import React, { useEffect, useState } from "react";

const Modal = props => {
    const { title = "", children, open = false, onClose } = props;

    const [openState, setOpenState] = useState(open);

      const onCloseModal = () => {
        setOpenState(false);
        onClose?.();
      }

    useEffect(() => {
        if (open) {
            setOpenState(open);
        } else {
            onCloseModal();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])


    return openState && (
        <div className="Modal-Background">
            <div className="Modal-Root">
                <div className="Modal-Header">
                    <h1>{title}</h1>
                    <button className="close" onClick={onCloseModal}>&times;</button>
                </div>
                <div className="Modal-Body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
