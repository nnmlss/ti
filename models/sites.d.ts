export type WindDirection = 'N' | 'NNE' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE' | 'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW';
export interface LocalizedText {
    bg?: string;
    en?: string;
}
export interface GalleryImage {
    path: string;
    author: string;
    width: number;
    height: number;
}
export interface Location {
    type: 'Point';
    coordinates: [number, number];
}
export interface AccessOption {
    _id: number;
    bg?: string[];
    en?: string[];
}
export interface FlyingSite {
    _id: number;
    title: LocalizedText;
    windDirection: WindDirection[];
    location: Location;
    accessOptions: AccessOption[];
    altitude?: number;
    galleryImages?: GalleryImage[];
    accomodations?: {
        bg?: string[];
        en?: string[];
    };
    alternatives?: LocalizedText;
    access?: LocalizedText;
    landingFields?: string;
    tracklogs?: string[];
    localPilotsClubs?: string;
}
//# sourceMappingURL=sites.d.ts.map