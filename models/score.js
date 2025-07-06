import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  jury: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jury',
    required: true,
  },
  contestant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contestant',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  teamName: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['A', 'B'],
    required: true,
  },
  rank: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique score per jury, contestant, and item
ScoreSchema.index({ jury: 1, contestant: 1, item: 1 }, { unique: true });

const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

export default Score;