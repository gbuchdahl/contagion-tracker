import React from "react";
import { Hero, Container } from "react-bulma-components";

const Banner = () => {
  return (
    <Hero className="mb-5 is-warning">
      <Container className="hero-body">
        <h1 className="title">Contagion Tracker</h1>
      </Container>
    </Hero>
  );
};

export default Banner;
