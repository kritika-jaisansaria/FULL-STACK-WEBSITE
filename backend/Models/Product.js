import mongoose from 'mongoose';

const metalDetailsSchema = new mongoose.Schema({
  karatage: { type: String, required: false },
  grossWeight: { type: String, required: false },
  metal: { type: String, required: false },
  earringHeight: { type: String, required: false },
  earringWidth: { type: String, required: false },
  materialColour: { type: String, required: false },
});

const generalDetailsSchema = new mongoose.Schema({
  jewelleryType: { type: String, required: false },
  productType: { type: String, required: false },
  brand: { type: String, required: false },
  collection: { type: String, required: false },
  gender: { type: String, required: false },
  occasion: { type: String, required: false },
});

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: false },
  url: { type: String, required: false },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },      // required
  price: { type: Number, required: true },     // required
  description: { type: String, required: false },
  category: { type: String, required: false },
  style: { type: String, required: false },
  metalDetails: { type: metalDetailsSchema, required: false },
  generalDetails: { type: generalDetailsSchema, required: false },
  media: { type: [mediaSchema], required: false },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);