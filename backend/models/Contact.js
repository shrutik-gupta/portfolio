import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: 0 },
    message: { type: String, default: 0 }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;