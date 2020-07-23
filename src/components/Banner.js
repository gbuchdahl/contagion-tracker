import React from "react";
import { Hero, Container } from "react-bulma-components";

const Banner = () => {
  return (
    <Hero className="mb-5 is-warning is-bold is-medium">
      <Container className="hero-body has-text-centered">
        <h1 className="title is-size-1">
          <span className="icon mr-5">
            <i className="fas fa-radiation-alt"></i>
          </span>
          Contagion Tracker
          <span className="icon ml-5">
            <i className="fas fa-radiation-alt"></i>
          </span>
        </h1>
        <h3 className="subtitle is-size-5 has-text-grey mt-2">
          Visualizing "viral" trends across the world.
        </h3>
      </Container>
    </Hero>
  );
};

export default Banner;
