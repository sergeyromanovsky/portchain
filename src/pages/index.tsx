import React from 'react';
import { Switch, Route } from 'react-router-dom';
import VesselList from './VesselList';
import VesselDetails from './VesselDetails';
import { Wrapper } from './styled';

function App() {
  return (
    <Wrapper>
      <Switch>
        <Route path='/' exact>
          <VesselList />
        </Route>
        <Route path='/:id'>
          <VesselDetails />
        </Route>
      </Switch>
    </Wrapper>
  );
}

export default App;
