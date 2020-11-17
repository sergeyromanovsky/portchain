import React from 'react';
import VesselList from './VesselList';

import { Switch, Route } from 'react-router-dom';
import { Wrapper } from './styled';

function App() {
  return (
    <Wrapper>
      <Switch>
        <Route path='/' exact>
          <VesselList />
        </Route>
      </Switch>
    </Wrapper>
  );
}

export default App;
