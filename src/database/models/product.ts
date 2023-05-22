import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('product');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProductSchema = new Schema(
    {
      key: { type: String },
      label: { type: String },
      prodName: {
        type: String,
        required: true,
      },
      prodDescr: {
        type: String,
      },
      partNumber: {
        type: String,
        required: true,
      },
      baseLine: {
        type: Boolean,
        default: false,
      },
      prodType: {
        type: Schema.Types.ObjectId,
        ref: 'prodtype',
      },
      partUnit: {
        type: Schema.Types.ObjectId,
        ref: 'unit',
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true,
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String },
    },
    { timestamps: true },
  );

  ProductSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProductSchema.index(
    { prodName: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        prodName: { $type: 'string' },
      },
    },
  );

  ProductSchema.index(
    { partNumber: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        partNumber: { $type: 'string' },
      },
    },
  );

  ProductSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProductSchema.set('toJSON', {
    getters: true,
  });

  ProductSchema.set('toObject', {
    getters: true,
  });

  return database.model('product', ProductSchema);
};
