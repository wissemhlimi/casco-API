import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('pRODUCTunit');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PRODUCTunitSchema = new Schema(
    {
      prodId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
      produrId: {
        type: Schema.Types.ObjectId,
        ref: 'produr',
      },
      pRODlineUQ: {
        type: String,
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

  PRODUCTunitSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PRODUCTunitSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PRODUCTunitSchema.set('toJSON', {
    getters: true,
  });

  PRODUCTunitSchema.set('toObject', {
    getters: true,
  });

  return database.model('pRODUCTunit', PRODUCTunitSchema);
};
