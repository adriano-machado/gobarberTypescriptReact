import React from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  function handleSubmit(data: object): void {}
  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form initialData={{}} onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          <Input name="name" icon={FiUser} placeholder="Name" />

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />
          <Button type="submit">Register</Button>
        </Form>

        <a href="forgot">
          <FiArrowLeft size={20} />
          Back to logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
