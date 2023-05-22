import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('config');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ConfigSchema = new Schema(
    {
      configTitle: {
        type: String,
        required: true,
      },
      configRef: {
        type: String,
        required: true,
      },
      configDate: {
        type: String,
      },
      configStatus: {
        type: String,
        enum: [
          "active",
          "locked",
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

  ConfigSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ConfigSchema.index(
    { configTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        configTitle: { $type: 'string' },
      },
    },
  );

  ConfigSchema.index(
    { configRef: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        configRef: { $type: 'string' },
      },
    },
  );  

  ConfigSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ConfigSchema.set('toJSON', {
    getters: true,
  });

  ConfigSchema.set('toObject', {
    getters: true,
  });

  return database.model('config', ConfigSchema);
};
