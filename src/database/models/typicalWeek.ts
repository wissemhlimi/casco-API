import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('typicalWeek');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TypicalWeekSchema = new Schema(
    {
      days: [
        {
          name: {
            type: String,
          },
          status: {
            type: Boolean,
            default: false,
          },
          workingHours: [
            {
              type: String,
            },
          ],
        },
      ],
      name: {
        type: String,
      },
      mainCalendar: {
        type: Schema.Types.ObjectId,
        ref: 'calendarMain',
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

  TypicalWeekSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  TypicalWeekSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TypicalWeekSchema.set('toJSON', {
    getters: true,
  });

  TypicalWeekSchema.set('toObject', {
    getters: true,
  });

  return database.model('typicalWeek', TypicalWeekSchema);
};
