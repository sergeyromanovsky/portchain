import React from 'react';

import { Typography } from '@material-ui/core';
import { Flex } from 'components/Flex/styled';
import { StyledName } from '../styled';
import { IPercantileList, IPercantile, ICallDelayPercentile } from '..';
import { IPortMetadata } from '../interfaces';

interface IProps {
  list: IPercantileList;
}

const isPortMetaType = (delay: IPercantile): delay is IPortMetadata =>
  (delay as IPortMetadata).name !== undefined;

function TopList({ list }: IProps) {
  return (
    <div>
      <Typography variant='h4'>Percentiles</Typography>
      <Flex style={{ gap: '5rem' }} flexWrap>
        {list.map(({ title, value: callDelay }) => {
          const [ranks, value] = callDelay;
          return (
            <ul key={title}>
              <Typography>{title}</Typography>
              {ranks.map((rank, index) => {
                return (
                  <Flex key={rank}>
                    <StyledName>{rank}th:</StyledName>
                    <strong>
                      {isPortMetaType(value[index])
                        ? (value[index] as IPortMetadata).name
                        : (value[index] as ICallDelayPercentile).vessel.name}
                    </strong>
                  </Flex>
                );
              })}
            </ul>
          );
        })}
      </Flex>
    </div>
  );
}

export default TopList;
