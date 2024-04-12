import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_LINK}`);
        console.log('mongodb database connected!')
    } catch (error) {
        console.log('error connecting to mongodb');
        console.log(error);
    }
}
export { connectDB };