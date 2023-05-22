import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('prodtype');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProdtypeSchema = new Schema(
    {
      prodtypeName: {
        type: String,
        required: true,
      },
      prodtypePlan: {
        type: String,
        enum: [
          "yes",
          "no",
          null
        ],
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

  ProdtypeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProdtypeSchema.index(
    { prodtypeName: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        prodtypeName: { $type: 'string' },
      },
    },
  );  

  ProdtypeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProdtypeSchema.set('toJSON', {
    getters: true,
  });

  ProdtypeSchema.set('toObject', {
    getters: true,
  });

  return database.model('prodtype', ProdtypeSchema);
};
