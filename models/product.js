var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var schema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'}, //Here ref: category is taken from the category.js model.
    image: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true}
});
//Using mongoosastic to connect product database into the search functionality
 schema.plugin(mongoosastic,{
   hosts: [
     'localhost:9200'
   ]
 });

schema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
});

module.exports = mongoose.model('Product', schema);
