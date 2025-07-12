import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    get: (value) => value.toUpperCase(),
  },
  category: {
    type: String,
    enum: ['subjunior', 'junior', 'senior', 'general(individual)', 'general(group)'],
    required: true,
  },
  type: {
    type: String,
    enum: ['A', 'B'],
    required: true,
  },
  stage: {
    type: String,
    enum: ['stage', 'offstage'],
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' }],
  isChecked: { type: Boolean, default: false },
  date: { type: Date },
  day: { type: String },
  timeRange: {
    start: { type: String },
    end: { type: String },
  },
  published: {
    type: Boolean,
    default: false,
  },
  codeLetter: [{
    contestantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' },
    codeLetter: { type: String, match: /^[a-xz]$/ }, // Single letter a-x or z (excludes 'y')
  }],
});

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default Item;