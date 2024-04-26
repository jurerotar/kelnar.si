import React, { Suspense } from 'react';
import ReactModal, { Props as ReactModalProps } from 'react-modal';

type ModalProps = ReactModalProps & {
  closeHandler: () => void;
  title?: string;
  hasTitle?: boolean;
};

export const Modal: React.FC<ModalProps> = (props) => {
  const { isOpen = false, closeHandler, hasTitle, title, children, ...rest } = props;

  return (
    <Suspense fallback={null}>
      <ReactModal
        {...rest}
        isOpen={isOpen}
        overlayClassName="flex justify-center items-center fixed left-0 top-0 z-20 h-screen w-screen backdrop-brightness-50 transition-opacity duration-300"
        className="m-4 w-full max-w-[600px] rounded-md bg-white p-4 md:m-0 md:min-w-[600px]"
        shouldCloseOnOverlayClick
        onRequestClose={closeHandler}
        appElement={document.getElementById('root') as HTMLElement}
      >
        <div className="relative size-full">
          {/* Modal header */}
          {hasTitle && (
            <div className="mb-2 border-b border-gray-300">
              {/* Modal title */}
              <div className="flex max-w-[90%] items-center pb-2">
                <h3>{title}</h3>
              </div>
            </div>
          )}
          {/* Close button */}
          <div className="absolute right-0 top-0">
            <button onClick={closeHandler} />
          </div>
          <div className="max-h-[500px] overflow-y-scroll">{children}</div>
        </div>
      </ReactModal>
    </Suspense>
  );
};
