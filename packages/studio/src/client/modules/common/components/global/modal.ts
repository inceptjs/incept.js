//hooks
import React, { useState } from 'react'; 
//components
import Modal from 'frui/tailwind/Modal';

const modal: Record<string, any> = {};
export default modal;

export const ModalProvider = () => {
  const [ opened, setOpened ] = useState(false);
  const [ className, setClassName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ body, setBody ] = useState<React.ReactNode|undefined>();

  modal.className = (className: string) => setClassName(className);
  modal.title = (title: string) => setTitle(title);
  modal.body = (body: React.ReactNode|undefined) => setBody(body);
  modal.open = (open = true) => setOpened(open);
  modal.opened = opened;

  return React.createElement(Modal, {
    opened, 
    title, 
    className, 
    onClose: () => setOpened(false), 
  }, body);
};