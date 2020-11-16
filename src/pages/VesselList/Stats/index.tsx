import { Typography } from '@material-ui/core';
import { portState } from 'atoms/port.atom';
import { Flex } from 'components/Flex/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { StyledName } from './styled';

function Stats() {
  const {
    topByArrivals,
    topByFewestPortCalls,
    totalPortCalls,
  } = useRecoilValue(portState);

  return (
    <Flex justifyAround>
      {topByArrivals && (
        <ul>
          <Typography>Top 5 Ports with most arrivals</Typography>
          {topByArrivals.map(({ arrivalsCount, name }) => (
            <Flex key={name}>
              <StyledName>{name}:</StyledName>
              <strong>{arrivalsCount}</strong>
            </Flex>
          ))}
        </ul>
      )}

      {topByFewestPortCalls && (
        <ul>
          <Typography>Top 5 Ports with fewest port calls</Typography>
          {topByFewestPortCalls.map(({ name, portCallsCount }) => (
            <Flex key={name}>
              <StyledName>{name}:</StyledName>
              <strong>
                {portCallsCount} of {totalPortCalls}
              </strong>
            </Flex>
          ))}
        </ul>
      )}
    </Flex>
  );
}

export default Stats;
