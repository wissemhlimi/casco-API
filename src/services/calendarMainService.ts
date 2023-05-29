import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import CalendarMainRepository from '../database/repositories/calendarMainRepository';
import TypicalWeekRepository from '../database/repositories/typicalWeekRepository';
import SpecialCalendarRepository from '../database/repositories/specialCalendarRepository';

export default class CalendarMainService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.typicalWeek =
        await TypicalWeekRepository.filterIdsInTenant(
          data.typicalWeek,
          { ...this.options, session },
        );
      data.specialCalendar =
        await SpecialCalendarRepository.filterIdsInTenant(
          data.specialCalendar,
          { ...this.options, session },
        );

      const record = await CalendarMainRepository.create(
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'calendarMain',
      );

      throw error;
    }
  }
  async copy(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.typicalWeek =
        await TypicalWeekRepository.filterIdsInTenant(
          data.typicalWeek,
          { ...this.options, session },
        );
      data.specialCalendar =
        await SpecialCalendarRepository.filterIdsInTenant(
          data.specialCalendar,
          { ...this.options, session },
        );

      const record = await CalendarMainRepository.copy(
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'calendarMain',
      );

      throw error;
    }
  }
  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.typicalWeek =
        await TypicalWeekRepository.filterIdsInTenant(
          data.typicalWeek,
          { ...this.options, session },
        );
      data.specialCalendar =
        await SpecialCalendarRepository.filterIdsInTenant(
          data.specialCalendar,
          { ...this.options, session },
        );

      const record = await CalendarMainRepository.update(
        id,
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'calendarMain',
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await CalendarMainRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id) {
    return CalendarMainRepository.findById(
      id,
      this.options,
    );
  }

  async findAllAutocomplete(search, limit) {
    return CalendarMainRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return CalendarMainRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await CalendarMainRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
