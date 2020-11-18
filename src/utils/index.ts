import dayjs, { QUnitType } from 'dayjs';
import getPercentile from 'percentile';

import {
  IPortCall,
  IPortMetadata,
  IVesselDetails,
} from 'pages/VesselList/interfaces';
import { CALCULATE_FOR_DAYS } from './constants';

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

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type IDaysDelay = ElementType<typeof CALCULATE_FOR_DAYS>;

export const getCallDelay = (
  portCalls: IPortCall[],
  daysDelay = CALCULATE_FOR_DAYS,
  unit: QUnitType = 'day'
) => {
  const result = portCalls.reduce((acc, currItem) => {
    currItem.logEntries.forEach(({ createdDate, arrival }) => {
      if (arrival) {
        const diffInDays = dayjs(currItem.arrival).diff(createdDate, unit);
        if ((daysDelay as string[]).includes(String(diffInDays))) {
          // use seconds calculate percentile after
          const diffInSeconds = dayjs(currItem.arrival).diff(
            createdDate,
            'second'
          );

          const stringified = String(diffInDays) as IDaysDelay;
          acc[stringified] = (acc[stringified] || 0) + diffInSeconds;
        }
      }
    });

    return acc;
  }, {} as Record<IDaysDelay, number>);
  return result;
};

interface ISort<T> {
  arr: T[];
  order?: 'asc' | 'desc';
  sortExtractor?: (item: T) => any;
  modifier?: (arr: T[]) => T[];
}
export const sort = <T>({
  arr,
  order = 'asc',
  sortExtractor = (item) => item,
  modifier,
}: ISort<T>) => {
  let result = arr.slice(0).sort((a: T, b: T) => {
    switch (order) {
      case 'asc':
        return +sortExtractor(a) - +sortExtractor(b);
      default:
      case 'desc':
        return +sortExtractor(b) - +sortExtractor(a);
    }
  });
  if (modifier) {
    result = modifier.call(null, result);
  }
  return result;
};

export const getPortMeta = (arr: IVesselDetails[]) => {
  let totalCalls = 0;
  const portsMeta = arr.reduce((acc, { portCalls }) => {
    totalCalls += portCalls.length;
    portCalls.forEach(({ port, arrival, departure, isOmitted }) => {
      const portId = port.id;
      acc[portId] = {
        name: port.name,
        arrivalsCount: calculateArrivalsCount({
          acc,
          isOmitted,
          portId,
        }),
        portCallsCount: calculatePortCallsCount({ acc, portId }),
        callDuration: calculatePortCallDuration({
          acc,
          portId,
          arrival,
          departure,
        }),
      };
    });

    return acc;
  }, {} as Record<string, IPortMetadata>);

  return { portsMeta, totalCalls };
};
