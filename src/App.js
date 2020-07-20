import React, { useState, useEffect } from 'react';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';

import { Container, Hero, Tabs, Columns } from 'react-bulma-components' 


function App() {

  const [currentTime, setCurrentTime] = useState(0);
  const [location, setLocation] = useState("USA");

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="App">
        <Hero className='is-warning'>
          <Container className="hero-body">
            <h1 className='title'>
              Contagion Tracker
            </h1>
          </Container>
        </Hero>
        <Container className='is-centered'>
          <Columns>
            <Columns.Column />
            <Columns.Column>
              <Tabs className='is-centered'>
                  <ul>
                    <li className={(location === "USA") ? "is-active" : ""}><a onClick={() => setLocation("USA")}>US Data</a></li>
                    <li className={(location === "Global") ? "is-active" : ""}><a onClick={() => setLocation("Global")}>Global Data</a></li>
                  </ul>
               </Tabs>
               <h1 className='is-title is-1'>{(location==="USA") ? "US MAP" : "WORLD MAP"}</h1>
            </Columns.Column>
            <Columns.Column />
          </Columns>


        </Container>

    </div>

  );
}

export default App;
