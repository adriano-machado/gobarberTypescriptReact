import React from 'react';

import { useTransition } from 'react-spring';
import { ToastMessage } from '../../context/ToastContainer';
import { Container } from './styles';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: {
        right: '-120%',
        // transform: 'rotateZ(0deg)',
        opacity: 0,
      },
      enter: {
        right: '0%',
        // transform: 'rotateZ(360deg)',
        opacity: 1,
      },
      leave: {
        right: '-120%',
        // transform: 'rotateZ(0deg)',
        opacity: 0,
      },
    },
  );
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast toast={item} style={props} key={key} />
      ))}
    </Container>
  );
};

export default ToastContainer;
