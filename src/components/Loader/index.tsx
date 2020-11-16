import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Wrapper } from './styled';

export const LOADER_TEST_ID = 'loader';
function Loader() {
  return (
    <Wrapper data-testid={LOADER_TEST_ID}>
      <CircularProgress />
    </Wrapper>
  );
}

export default Loader;
