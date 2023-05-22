import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('unit');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const UnitSchema = new Schema(
    {
      unitTitle: {
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

  UnitSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  UnitSchema.index(
    { unitTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        unitTitle: { $type: 'string' },
      },
    },
  );  

  UnitSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  UnitSchema.set('toJSON', {
    getters: true,
  });

  UnitSchema.set('toObject', {
    getters: true,
  });

  return database.model('unit', UnitSchema);
};
