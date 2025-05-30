const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const jurySchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    assignedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
},{ collection: 'jury' });

// Hash password before saving
jurySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Jury = mongoose.models.Jury || mongoose.model('Jury', jurySchema);

export default Jury;


