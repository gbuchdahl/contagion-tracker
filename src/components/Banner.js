import React from "react";
import { Hero, Container } from "react-bulma-components";

const Banner = () => {
  return (
    <Hero className="mb-5 is-warning is-bold is-medium">
      <Container className="hero-body">
        <h1 className="title is-1">
          <span className="icon mr-5">
            <i className="fas fa-radiation-alt"></i>
          </span>
          Contagion Tracker
          <span className="icon ml-5">
            <i className="fas fa-radiation-alt"></i>
          </span>
        </h1>
      </Container>
    </Hero>
  );
};

export default Banner;
