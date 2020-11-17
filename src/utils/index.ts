import dayjs from 'dayjs';
import getPercentile from 'percentile';

import { IPortCall, IVessel } from 'pages/VesselList/interfaces';

interface ICalculateCallDuration {
  departure: string;
  arrival: string;
}

interface ICalculate {
  acc: Record<any, any>;
  portId: string;
}

interface ICalculateArrivals extends ICalculate {
  isOmitted: boolean;
}

interface ICalculatePortCallDuration
  extends ICalculateCallDuration,
    ICalculate {}

export interface ICallDelay {
  vessel: IVessel;
  delayInFourteenDays: number;
  delayInSevenDays: number;
  delayInTwoDays: number;
}

export const calculateCallDuration = ({
  departure,
  arrival,
}: ICalculateCallDuration) => Date.parse(departure) - Date.parse(arrival);

export const calculateArrivalsCount = ({
  acc,
  portId,
  isOmitted,
}: ICalculateArrivals): number =>
  (acc[portId]?.arrivalsCount || 0) + (isOmitted ? 0 : 1);

export const calculatePortCallsCount = ({ acc, portId }: ICalculate): number =>
  (acc[portId]?.portCallsCount || 0) + 1;

export const calculatePortCallDuration = ({
  acc,
  portId,
  arrival,
  departure,
}: ICalculatePortCallDuration): number =>
  (acc[portId]?.callDuration || 0) +
  calculateCallDuration({ arrival, departure });

export const calculatePercentile = <T>(
  interestedPercentile: number[],
  sortedArray: T[]
): [number[], T[]] => {
  const percentile = getPercentile(interestedPercentile, sortedArray) as T[];

  return [interestedPercentile, percentile];
};

export const getCallDelay = (
  portCalls: IPortCall[],
  initialState: ICallDelay
) => {
  return portCalls.reduce((acc, currItem) => {
    let delayInFourteenDays = 0;
    let delayInSevenDays = 0;
    let delayInTwoDays = 0;
    currItem.logEntries.forEach(({ createdDate, arrival }) => {
      if (arrival) {
        const diffInDays = dayjs(currItem.arrival).diff(createdDate, 'day');
        // use seconds to get more precisely results
        const diffInSeconds = dayjs(currItem.arrival).diff(
          createdDate,
          'second'
        );
        switch (diffInDays) {
          case 14:
            delayInFourteenDays += diffInSeconds;
            break;
          case 7:
            delayInSevenDays += diffInSeconds;
            break;
          case 2:
            delayInTwoDays += diffInSeconds;
            break;
        }
      }
    });

    acc.delayInFourteenDays += delayInFourteenDays;
    acc.delayInSevenDays += delayInSevenDays;
    acc.delayInTwoDays += delayInTwoDays;
    return acc;
  }, initialState);
};
