import mongoose, { Document } from 'mongoose';
export type WindDirection = 'N' | 'NNE' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE' | 'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW';
export interface LocalizedText {
    bg?: string;
    en?: string;
}
export interface Location {
    type: 'Point';
    coordinates: [number | null, number | null];
}
export interface GalleryImage {
    path: string;
    author?: string;
    width?: number;
    height?: number;
}
export interface AccessOption {
    _id: number;
    bg?: string;
    en?: string;
}
export interface LandingFieldInfo {
    description?: string;
    location?: Location;
}
export interface FlyingSite {
    title: LocalizedText;
    windDirection: WindDirection[];
    location: Location;
    accessOptions: AccessOption[];
    altitude?: number | null;
    galleryImages?: GalleryImage[];
    accomodations?: {
        bg?: string[];
        en?: string[];
    };
    alternatives?: {
        bg?: string[];
        en?: string[];
    };
    access?: LocalizedText;
    landingFields?: {
        bg?: LandingFieldInfo[];
        en?: LandingFieldInfo[];
    };
    tracklogs?: string[];
    localPilotsClubs?: {
        bg?: string[];
        en?: string[];
    };
}
export interface FlyingSiteDocument extends FlyingSite, Document {
}
export declare const Site: mongoose.Model<FlyingSiteDocument, {}, {}, {}, mongoose.Document<unknown, {}, FlyingSiteDocument, {}, {}> & FlyingSiteDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=sites.d.ts.map