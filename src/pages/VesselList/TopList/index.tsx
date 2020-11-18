import React from 'react';

import { Typography } from '@material-ui/core';
import { Flex } from 'components/Flex/styled';
import { StyledName } from '../styled';
import { ITop } from '..';

interface IProps {
  list: ITop[];
}
function TopList({ list }: IProps) {
  return (
    <div style={{marginBottom: '2rem'}}>
      <Typography variant='h4'>Tops</Typography>
      <Flex style={{ gap: '5rem' }}>
        {list.map(({ title, value, total }) => {
          return (
            <ul key={title}>
              <Typography>{title}</Typography>
              {value.map(({ name, portCallsCount }) => (
                <Flex key={name}>
                  <StyledName>{name}:</StyledName>
                  <strong>
                    {portCallsCount} {total && `of ${total}`}
                  </strong>
                </Flex>
              ))}
            </ul>
          );
        })}
      </Flex>
    </div>
  );
}

export default TopList;
