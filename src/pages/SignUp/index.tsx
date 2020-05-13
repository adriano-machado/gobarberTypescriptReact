import React from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => (
  <Container>
    <Background />

    <Content>
      <img src={logoImg} alt="GoBarber" />
      <form>
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
      </form>

      <a href="forgot">
        <FiArrowLeft size={20} />
        Back to logon
      </a>
    </Content>
  </Container>
);

export default SignUp;
