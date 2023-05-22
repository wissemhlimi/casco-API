import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('pRODUCTline');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PRODUCTlineSchema = new Schema(
    {
      pRODlinePRODID: {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
      baseLine: {
        line: {
          type: Schema.Types.ObjectId,
          ref: 'prodline',
        },
        prodlineUq: {
          type: Number,
        },
        prodlineUpt: {
          type: Number,
        },
      },
      lines: [
        {
          line: {
            type: Schema.Types.ObjectId,
            ref: 'prodline',
          },
          prodlineUq: {
            type: Number,
          },
          prodlineUpt: {
            type: Number,
          },
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

  PRODUCTlineSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PRODUCTlineSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PRODUCTlineSchema.set('toJSON', {
    getters: true,
  });

  PRODUCTlineSchema.set('toObject', {
    getters: true,
  });

  return database.model('pRODUCTline', PRODUCTlineSchema);
};
