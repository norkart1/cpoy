import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['subjunior', 'junior', 'senior', 'general(individual)', 'general(group)'],
    required: true
  },
  type: {
    type: String,
    enum: ['A', 'B'],
    required: true
  },
  stage: {
    type: String,
    enum: ['stage', 'offstage'],
    required: true
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' }],
  isChecked: { type: Boolean, default: false },
  date: { type: Date }, // Stores selected date
  day: { type: String }, // Stores text day (e.g., "Monday")
  timeRange: {
    start: { type: String }, // e.g., "07:55"
    end: { type: String }, // e.g., "08:00"
  },
});

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default Item;