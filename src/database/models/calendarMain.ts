import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('calendarMain');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CalendarMainSchema = new Schema(
    {
      title: {
        type: String,
        maxlength: 1000,
      },
      active: {
        type: Boolean,
        default: false
      },
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
      fraquence: {
        type: Number,
      },
      comment: {
        type: String,
        maxlength: 5000,
      },
      typicalWeek: [{
        type: Schema.Types.ObjectId,
        ref: 'typicalWeek',
      }],
      specialCalendar: [{
        type: Schema.Types.ObjectId,
        ref: 'specialCalendar',
      }],
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

  CalendarMainSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  CalendarMainSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CalendarMainSchema.set('toJSON', {
    getters: true,
  });

  CalendarMainSchema.set('toObject', {
    getters: true,
  });

  return database.model('calendarMain', CalendarMainSchema);
};
