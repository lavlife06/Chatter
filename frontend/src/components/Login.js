import React, { useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { login } from "../reduxstuff/actions/auth";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    login({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  }

  return (
    <Container
      className="align-items-center "
      style={{ height: "100vh", marginTop: "10%" }}
    >
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Enter Your Email</Form.Label>
          <Form.Control type="email" ref={emailRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter Your Password</Form.Label>
          <Form.Control type="password" ref={passwordRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Login
        </Button>
      </Form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </Container>
  );
};
export default Login;
