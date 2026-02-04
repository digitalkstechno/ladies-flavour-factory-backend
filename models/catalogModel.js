const mongoose = require('mongoose');

const catalogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;