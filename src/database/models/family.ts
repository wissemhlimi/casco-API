import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('family');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const FamilySchema = new Schema(
    {
      key: { type: String },
      label: { type: String },
      famTitle: {
        type: String,
        required: true,
      },
      famDescr: {
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

  FamilySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  FamilySchema.index(
    { famTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        famTitle: { $type: 'string' },
      },
    },
  );

  FamilySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  FamilySchema.set('toJSON', {
    getters: true,
  });

  FamilySchema.set('toObject', {
    getters: true,
  });

  return database.model('family', FamilySchema);
};
