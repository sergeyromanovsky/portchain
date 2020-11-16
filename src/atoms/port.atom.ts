import { atom } from 'recoil';
import { IPortMetadata } from 'pages/VesselList';

interface IState {
  topByArrivals: null | IPortMetadata[];
  topByFewestPortCalls: null | IPortMetadata[];
  totalPortCalls: null | number;
}
export const portState = atom<IState>({
  key: 'portState',
  default: {
    topByArrivals: null,
    topByFewestPortCalls: null,
    totalPortCalls: null,
  },
});
