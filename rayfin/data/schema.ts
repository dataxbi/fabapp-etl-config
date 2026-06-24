import { EtlConfigIngestion } from './EtlConfigIngestion.js';

export type BlankAppSchema = {
  EtlConfigIngestion: EtlConfigIngestion;
};

export const schema = [EtlConfigIngestion];
