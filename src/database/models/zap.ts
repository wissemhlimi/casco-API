import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('zap');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ZapSchema = new Schema(
    {
      key: { type: String },
      label: { type: String },
      zapTitle: {
        type: String,
        required: true,
      },
      zapDescr: {
        type: String,
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

  ZapSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ZapSchema.index(
    { zapTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        zapTitle: { $type: 'string' },
      },
    },
  );

  ZapSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ZapSchema.set('toJSON', {
    getters: true,
  });

  ZapSchema.set('toObject', {
    getters: true,
  });

  return database.model('zap', ZapSchema);
};
