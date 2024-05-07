const mongoose=require('mongoose');
const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    required: 'This is required field.'
  },
  image:{
    type:String,
    required: 'This is required field.'
  },

});

module.exports=mongoose.model('Category',categorySchema);

