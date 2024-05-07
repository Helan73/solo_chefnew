const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required:true
    },
    createdRecipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    savedRecipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
});
userSchema.statics.comparePassword = async function(candidatePassword, hashedPassword) {
    try {
        // Ensure candidatePassword and hashedPassword are strings
        const candidate = String(candidatePassword);
        const hashed = String(hashedPassword);

        return await bcrypt.compare(candidate, hashed);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('User', userSchema);
