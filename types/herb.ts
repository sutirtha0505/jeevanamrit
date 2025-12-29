export interface HerbIdentification {
  commonName: string;
  latinName: string;
  confidenceLevel: string;
  description: string;
}

export interface HerbDetails {
  uses: string;
  chemicalConstituents: string;
  cultivation: string;
  preservation: string;
  origin: string;
  historicalContext: string;
}

export interface HerbCategory {
  medicinalProperties: string;
  cultivationMethods: string;
  climaticRequirements: string;
  category: string;
}

export interface AyurvedicApplications {
  ayurvedicApplications: string;
}

export interface HerbInfoState {
  success?: boolean;
  error?: string;
  identification?: HerbIdentification;
  details?: HerbDetails;
  category?: HerbCategory;
  ayurvedic?: AyurvedicApplications;
  location?: string;
  weather?: string;
}
