const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const recipeSchema = new mongoose.Schema({
  name:{
    type:String,
    required: 'This is required field.'
  },
  cookingtime:{
    type: String,
    required:true
  },
  ingredients: {
    type: [String],
    required: 'This is required field.'
  },
  instruction: {
    type:String,
    required: 'This is required field.'
  },
  category: {
    type: [String],
    enum: ['Indian','Spanish','Chinese','Thai','American','Mexican','Vegan','Shakes','Dessert','Cake','HealthyDrink','Icecreem','Snacks'],
    required: 'This is required field.'
  },
  image: {
    type:String,
    required: 'This is required field.'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User' 
},
});


module.exports=mongoose.model('Recipe', recipeSchema);