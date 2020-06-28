import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import getValidationError from '../../utils/getValidationErros';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../context/ToastContainer';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}
const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail is mandatory')
            .email('You must enter a valid e-mail'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', { email: data.email });
        addToast({
          type: 'success',
          title: 'A recover e-mail was sent.',
          description: 'We sent an e-mail to confirm your request',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Error to reset password',
          description: 'An error has ocurred, try again',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover Password</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recover
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn size={20} />
            Back to Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
