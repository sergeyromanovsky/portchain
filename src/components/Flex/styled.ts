import styled, { css } from 'styled-components';

export interface IMargins {
  mgl?: string;
  mgr?: string;
  mgb?: string;
  mgt?: string;
}

interface IFlex extends IMargins {
  justifyCenter?: boolean;
  justifyBetween?: boolean;
  justifyAround?: boolean;
  alignCenter?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  flexStart?: boolean;
  flexEnd?: boolean;
  flex?: string;
  flexWrap?: boolean;
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  full?: boolean;
  width?: string;
}

export const Flex = styled.div<IFlex>`
  display: flex;

  ${({ flex }) =>
    flex &&
    css`
      flex: ${flex};
    `}
  ${({ flexWrap }) =>
    flexWrap &&
    css`
      flex-wrap: wrap;
    `}
  ${({ justifyBetween }) =>
    justifyBetween &&
    css`
      justify-content: space-between;
    `}
  ${({ justifyAround }) =>
    justifyAround &&
    css`
      justify-content: space-around;
    `}
  ${({ justifyCenter }) =>
    justifyCenter &&
    css`
      justify-content: center;
    `}
  ${({ alignCenter }) =>
    alignCenter &&
    css`
      align-items: center;
    `}
  ${({ alignStart }) =>
    alignStart &&
    css`
      align-items: flex-start;
    `}
  ${({ alignEnd }) =>
    alignEnd &&
    css`
      align-items: flex-end;
    `}
  ${({ flexStart }) =>
    flexStart &&
    css`
      justify-content: flex-start;
    `}
  ${({ flexEnd }) =>
    flexEnd &&
    css`
      justify-content: flex-end;
    `}
  ${({ direction }) =>
    direction &&
    css`
      flex-direction: ${direction};
    `}

  ${({ full }) =>
    full &&
    css`
      width: 100%;
      height: 100%;
      flex-basis: 100%;
    `}

		margin-bottom: ${({ mgb }) => mgb};
`;
