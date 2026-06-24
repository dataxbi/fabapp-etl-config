import { EtlConfigIngestData } from './EtlConfigIngestData.js';

export type BlankAppSchema = {
  EtlConfigIngestData: EtlConfigIngestData;
};

export const schema = [EtlConfigIngestData];
