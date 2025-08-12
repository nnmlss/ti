var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        yield mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});
// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
}));
//# sourceMappingURL=database.js.map