export interface CapacityState {
  energy: number;
  attention: number;
  physical: number;
}

export type CheckInType = 'normal' | 'increase' | 'drop';

export interface CheckIn {
  id: string;
  timestamp: number;
  capacity: CapacityState;
  journal: string;
  overallCapacity: number;
  type: CheckInType;
}
