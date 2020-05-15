import React from 'react';
import { ToastMessage } from '../../context/ToastContainer';
import { Container } from './styles';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map(toast => (
        <Toast toast={toast} key={toast.id} />
      ))}
    </Container>
  );
};

export default ToastContainer;
