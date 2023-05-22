import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('configTable');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ConfigTableSchema = new Schema(
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
        enum: ['active', 'locked', null],
      },
      family: [
        {
          famId: {
            type: Schema.Types.ObjectId,
            ref: 'family',
          },

          linesId: [
            {
              lineId: {
                type: Schema.Types.ObjectId,
                ref: 'prodline',
              },

              prodsId: [
                {
                  type: Schema.Types.ObjectId,
                  ref: 'product',
                },
              ],
            },
          ],
        },
      ],

      zapId: [
        {
          zap: {
            type: Schema.Types.ObjectId,
            ref: 'zap',
          },
          linesId: [
            {
              type: Schema.Types.ObjectId,
              ref: 'prodline',
            },
          ],
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

  ConfigTableSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ConfigTableSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ConfigTableSchema.set('toJSON', {
    getters: true,
  });

  ConfigTableSchema.set('toObject', {
    getters: true,
  });

  return database.model('configTable', ConfigTableSchema);
};
