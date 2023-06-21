//components
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from '../../../common/components/modal';
//hooks
import { useEffect } from 'react';
//others
import { unload } from '../../../common/components/notify';

const LayoutBlankPage: React.FC<{
  head?: React.FC,
  children?: React.ReactNode
}> = props => {
  //unload flash message
  useEffect(unload, []);
  return (
    <section className="theme-dark bg-b1 text-t1 relative w-full h-full overflow-hidden">
      <>{props.head && <props.head />}</>
      <section className="absolute top-0 bottom-0 left-0 right-0 w-full">
        {props.children}
      </section>
      <ModalProvider />
      <ToastContainer />
    </section>
  );
};

export default LayoutBlankPage;