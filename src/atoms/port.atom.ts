import { IPortMetadata } from 'pages/VesselList/interfaces';
import { atom } from 'recoil';
import { ICallDelay } from 'utils';

interface IPercantile {
  byCallDuration: [number[], IPortMetadata[]];
  byDelayInFourteenDays: [number[], ICallDelay[]];
  byDelayInSevenDays: [number[], ICallDelay[]];
  byDelayInTwoDays: [number[], ICallDelay[]];
  [key: string]: any;
}
interface IState {
  topByArrivals: IPortMetadata[] | null;
  topByFewestPortCalls: IPortMetadata[] | null;
  percentile: IPercantile | null;
  totalPortCalls: number | null;
}
export const portState = atom<IState>({
  key: 'portState',
  default: {
    topByArrivals: null,
    topByFewestPortCalls: null,
    totalPortCalls: null,
    percentile: null,
  },
});
