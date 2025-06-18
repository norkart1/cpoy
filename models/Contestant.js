import mongoose from 'mongoose';

const contestantSchema = new mongoose.Schema({
  contestantNumber: { type: String, unique: true },
  name: { type: String, required: true },
  groupName: { type: String, required: true },
  category: {
    type: String,
    enum: ['subjunior', 'junior', 'senior'],
    required: true,
  },
  scratchCode: { type: String, default: null },
}, { collection: 'contestant' });

const Contestant = mongoose.models.Contestant || mongoose.model('Contestant', contestantSchema);

export default Contestant;
