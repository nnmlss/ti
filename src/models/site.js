import mongoose, { Schema, Document } from 'mongoose';
const LocationSchema = new Schema({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
});
const LocalizedTextSchema = new Schema({
    bg: { type: String },
    en: { type: String },
});
const GalleryImageSchema = new Schema({
    path: { type: String, required: true },
    author: { type: String },
    width: { type: Number },
    height: { type: Number },
});
const AccessOptionSchema = new Schema({
    _id: { type: Number, required: true },
    bg: [{ type: String }],
    en: [{ type: String }],
});
const LandingFieldInfoSchema = new Schema({
    description: LocalizedTextSchema,
    location: LocationSchema,
});
const FlyingSiteSchema = new Schema({
    _id: { type: Schema.Types.Mixed },
    title: { type: LocalizedTextSchema, required: true },
    windDirection: [
        {
            type: String,
            enum: [
                'N',
                'NNE',
                'NE',
                'ENE',
                'E',
                'ESE',
                'SE',
                'SSE',
                'S',
                'SSW',
                'SW',
                'WSW',
                'W',
                'WNW',
                'NW',
                'NNW',
            ],
            required: true,
        },
    ],
    location: { type: LocationSchema, required: true },
    accessOptions: [AccessOptionSchema],
    altitude: { type: Number },
    galleryImages: [GalleryImageSchema],
    accomodations: {
        bg: [{ type: String }],
        en: [{ type: String }],
    },
    alternatives: {
        bg: [{ type: String }],
        en: [{ type: String }],
    },
    access: LocalizedTextSchema,
    landingFields: [LandingFieldInfoSchema],
    tracklogs: [{ type: String }],
    localPilotsClubs: {
        bg: [{ type: String }],
        en: [{ type: String }],
    },
});
export const Site = mongoose.model('Site', FlyingSiteSchema, 'paragliding');
//# sourceMappingURL=site.js.map