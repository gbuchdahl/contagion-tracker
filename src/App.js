import React, { useState } from "react";
// import './App.css';
// import "react-bulma-components/dist/react-bulma-components.min.css";
import "./css/main.css";
import Banner from "./components/Banner";
import USMap from "./components/USMap";
import WorldMap from "./components/WorldMap";
import Footer from "./components/Footer";

import { Container, Tabs, Columns } from "react-bulma-components";

function App() {
  const [location, setLocation] = useState("Global");

  return (
    <div className="App">
      <Banner />
      <Container className="is-centered">
        <Columns>
          <Columns.Column />
          <Columns.Column>
            <Tabs className="is-centered is-boxed">
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
        <Columns>
          <Columns.Column className="is-three-fifths is-offset-one-fifth">
            {location === "USA" ? <USMap /> : <WorldMap />}
          </Columns.Column>
        </Columns>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
