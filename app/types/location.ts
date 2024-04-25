export type Location = {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent: string;
  continentCode: string;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  localityInfo: {
    administrative: [
      {
        name: string;
        description: string;
        isoName: string;
        order: number;
        adminLevel: number;
        isoCode: string;
        wikidataId: string;
        geonameId: number;
      },
      {
        name: string;
        description: string;
        isoName: string;
        order: number;
        adminLevel: number;
        isoCode: string;
        wikidataId: string;
        geonameId: number;
      },
      {
        name: string;
        description: string;
        order: number;
        adminLevel: number;
        wikidataId: string;
        geonameId: number;
      },
      {
        name: string;
        order: number;
        adminLevel: number;
      },
    ];
    informative: [
      {
        name: string;
        description: string;
        isoName: string;
        order: number;
        isoCode: string;
        wikidataId: string;
        geonameId: number;
      },
      {
        name: string;
        description: string;
        order: number;
        wikidataId: string;
        geonameId: number;
      },
      {
        name: string;
        description: string;
        order: number;
      },
    ];
  };
};
