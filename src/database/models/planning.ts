import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('planning');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PlanningSchema = new Schema(
    {
      name: {
        type: String,
      },
      week: {
        type: Number,
      },
      year: {
        type: Number,
      },
      status: {
        type: String,
        enum: ['draft', 'commited', null],
      },
      demande: [FileSchema],
      stock: [FileSchema],
      config: {
        type: Schema.Types.ObjectId,
        ref: 'configTable',
        required: true,
      },
      line: [
        {
          name: String,
          product: [
            {
              id: String,
              familyParent: String,
              lineParent: [String],
              quantityRequested: Number,
              quantityRemained: Number,
              quantityPlanned: Number,
              subassembly: Boolean,
              finishGood: Boolean,
              days: [
                {
                  day: String,
                  quantity: Number,
                  priority: Number,
                  priorityChecked: Boolean,
                },
              ],
            },
          ],
        },
      ],
      product: [
        {
          id: String,
          zapParent: [String],
          familyParent: String,
          lineParent: [String],
          quantityToProduce: Number,
          quantityRequested: Number,
          quantityInStock: Number,
          quantityInStockAfter: Number,
          quantityPlannedTotal: Number,
          subassembly: Boolean,
          finishGood: Boolean,
          demanded: Boolean,
          perWeek: [
            {
              week: String,
              quantity: Number,
              quantityToProduce: {
                value: Number,
                changed: Boolean,
              },
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

  PlanningSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PlanningSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PlanningSchema.set('toJSON', {
    getters: true,
  });

  PlanningSchema.set('toObject', {
    getters: true,
  });

  return database.model('planning', PlanningSchema);
};
