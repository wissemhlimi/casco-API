import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('prodline');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProdlineSchema = new Schema(
    {
      key: { type: String },
      label: { type: String },
      lineTitle: {
        type: String,
        required: true,
      },
      lineDescr: {
        type: String,
      },
      lineNoper: {
        type: Number,
        required: true,
      },
      lineDoc: [
        {
          type: Schema.Types.ObjectId,
          ref: 'linedoc',
        },
      ],
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

  ProdlineSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProdlineSchema.index(
    { lineTitle: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        lineTitle: { $type: 'string' },
      },
    },
  );

  ProdlineSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProdlineSchema.set('toJSON', {
    getters: true,
  });

  ProdlineSchema.set('toObject', {
    getters: true,
  });

  return database.model('prodline', ProdlineSchema);
};
