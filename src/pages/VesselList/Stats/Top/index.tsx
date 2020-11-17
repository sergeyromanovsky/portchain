import React from 'react';

import { Typography } from '@material-ui/core';
import { portState } from 'atoms/port.atom';
import { Flex } from 'components/Flex/styled';
import { useRecoilValue } from 'recoil';
import { StyledName, StyledUl } from '../styled';

function Top() {
  const {
    topByArrivals,
    topByFewestPortCalls,
    totalPortCalls,
  } = useRecoilValue(portState);
  return (
    <div style={{ marginBottom: '4rem' }}>
      <Typography variant='h4'>Tops</Typography>
      <Flex justifyBetween style={{ marginBottom: '1rem' }}>
        {topByArrivals && (
          <StyledUl>
            <Typography>Top 5 Ports with most arrivals</Typography>
            {topByArrivals.map(({ arrivalsCount, name }) => (
              <Flex key={name}>
                <StyledName>{name}:</StyledName>
                <strong>{arrivalsCount}</strong>
              </Flex>
            ))}
          </StyledUl>
        )}
        {topByFewestPortCalls && (
          <StyledUl>
            <Typography>Top 5 Ports with fewest port calls</Typography>
            {topByFewestPortCalls.map(({ name, portCallsCount }) => (
              <Flex key={name}>
                <StyledName>{name}:</StyledName>
                <strong>
                  {portCallsCount} of {totalPortCalls}
                </strong>
              </Flex>
            ))}
          </StyledUl>
        )}
      </Flex>
    </div>
  );
}

export default Top;
