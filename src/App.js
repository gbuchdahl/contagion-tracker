import React, { useState, useEffect } from "react";
// import './App.css';
import "react-bulma-components/dist/react-bulma-components.min.css";
import Banner from "./components/Banner";
import USMap from "./components/USMap";
import WorldMap from "./components/WorldMap";

import { Container, Tabs, Columns } from "react-bulma-components";

function App() {
  const [location, setLocation] = useState("USA");

  return (
    <div className="App">
      <Banner />
      <Container className="is-centered">
        <Columns>
          <Columns.Column />
          <Columns.Column>
            <Tabs className="is-centered">
              <ul>
                <li className={location === "USA" ? "is-active" : ""}>
                  <a onClick={() => setLocation("USA")}>US Data</a>
                </li>
                <li className={location === "Global" ? "is-active" : ""}>
                  <a onClick={() => setLocation("Global")}>Global Data</a>
                </li>
              </ul>
            </Tabs>
          </Columns.Column>
          <Columns.Column />
        </Columns>
        <h1 className="is-title is-1">
          {location === "USA" ? <USMap /> : <WorldMap />}
        </h1>
      </Container>
    </div>
  );
}

export default App;
