import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('produr');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProdurSchema = new Schema(
    {
      produrTitle: {
        type: String,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
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

  ProdurSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProdurSchema.index(
    { produrTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        produrTitle: { $type: 'string' },
      },
    },
  );  

  ProdurSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProdurSchema.set('toJSON', {
    getters: true,
  });

  ProdurSchema.set('toObject', {
    getters: true,
  });

  return database.model('produr', ProdurSchema);
};
