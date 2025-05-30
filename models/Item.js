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
    enum: ['C', 'A', 'B'], 
    required: true 
  },
  stage: { 
    type: String, 
    enum: ['stage', 'offstage'], 
    required: true 
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' }],
  isChecked: { type: Boolean, default: false },
});

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default Item;
