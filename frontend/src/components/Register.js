import React, { useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";
import { Link } from "react-router-dom";
import { register } from "../reduxstuff/actions/auth";
const Register = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    register({
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      uuid: uuidV4(),
    });
  }

  return (
    <Container
      className="align-items-center "
      style={{ height: "100vh", marginTop: "10%" }}
    >
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Enter Your Name</Form.Label>
          <Form.Control type="text" ref={nameRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter Your Email</Form.Label>
          <Form.Control type="email" ref={emailRef} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter Your Password</Form.Label>
          <Form.Control type="password" ref={passwordRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Singup
        </Button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Container>
  );
};

export default Register;
