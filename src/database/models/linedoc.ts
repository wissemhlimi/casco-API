import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('linedoc');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const LinedocSchema = new Schema(
    {
      lineId: [{
        type: Schema.Types.ObjectId,
        ref: 'prodline',
        required: true,
      }],
      linedocTitle: {
        type: String,
        required: true,
      },
      linedocLink: {
        type: String,
        required: true,
      },
      linedocType: {
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

  LinedocSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  LinedocSchema.index(
    { linedocLink: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        linedocLink: { $type: 'string' },
      },
    },
  );

  LinedocSchema.index(
    { linedocType: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        linedocType: { $type: 'string' },
      },
    },
  );  

  LinedocSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  LinedocSchema.set('toJSON', {
    getters: true,
  });

  LinedocSchema.set('toObject', {
    getters: true,
  });

  return database.model('linedoc', LinedocSchema);
};
