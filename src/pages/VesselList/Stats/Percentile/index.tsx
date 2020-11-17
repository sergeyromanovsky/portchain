import React from 'react';
import { portState } from 'atoms/port.atom';
import { useRecoilValue } from 'recoil';
import { Typography } from '@material-ui/core';
import { Flex } from 'components/Flex/styled';
import { StyledName, StyledUl } from '../styled';

const titleMapping: Record<string, string> = {
  byCallDuration: 'Call Duration',
  byDelayInFourteenDays: 'Port Call Delay in 14 Days',
  byDelayInSevenDays: 'Port Call Delay in 7 Days',
  byDelayInTwoDays: 'Port Call Delay in 2 Days',
};

function Percantile() {
  const { percentile } = useRecoilValue(portState);
  if (!percentile) {
    return null;
  }

  return (
    <>
      <Typography variant='h4'>Percentiles</Typography>
      <Flex justifyBetween flexWrap style={{ gap: '1rem' }}>
        {Object.keys(percentile).map((key) => {
          return (
            <StyledUl key={key}>
              <Typography>Percantile by {titleMapping[key]}</Typography>
              {percentile[key][0].map((item: number, index: number) => (
                <Flex key={key + index}>
                  <StyledName>{item}th:</StyledName>
                  <strong>
                    {percentile[key][1][index].name ||
                      percentile[key][1][index].vessel.name}
                  </strong>
                </Flex>
              ))}
            </StyledUl>
          );
        })}
      </Flex>
    </>
  );
}

export default Percantile;
