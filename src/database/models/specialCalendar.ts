import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('specialCalendar');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const SpecialCalendarSchema = new Schema(
    {
      name: {
        type: String,
      },
      date: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      active: {
        type: Boolean,
        default: false,
      },
      singleDay: {
        type: Boolean,
        default: false,
      },
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

  SpecialCalendarSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  SpecialCalendarSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  SpecialCalendarSchema.set('toJSON', {
    getters: true,
  });

  SpecialCalendarSchema.set('toObject', {
    getters: true,
  });

  return database.model(
    'specialCalendar',
    SpecialCalendarSchema,
  );
};
