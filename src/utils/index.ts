interface ICalculateCallDuration {
  departure: string;
  arrival: string;
}

export const calculateCallDuration = ({
  departure,
  arrival,
}: ICalculateCallDuration) => Date.parse(departure) - Date.parse(arrival);

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
