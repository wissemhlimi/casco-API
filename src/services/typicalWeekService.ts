import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import TypicalWeekRepository from '../database/repositories/typicalWeekRepository';
import CalendarMainRepository from '../database/repositories/calendarMainRepository';

export default class TypicalWeekService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.mainCalendar =
        await CalendarMainRepository.filterIdInTenant(
          data.mainCalendar,
          { ...this.options, session },
        );

      const record = await TypicalWeekRepository.create(
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
        'typicalWeek',
      );

      throw error;
    }
  }

  async copy(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.mainCalendar =
        await CalendarMainRepository.filterIdInTenant(
          data.mainCalendar,
          { ...this.options, session },
        );

      const record = await TypicalWeekRepository.copy(
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
        'typicalWeek',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.mainCalendar =
        await CalendarMainRepository.filterIdInTenant(
          data.mainCalendar,
          { ...this.options, session },
        );

      const record = await TypicalWeekRepository.update(
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
        'typicalWeek',
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
        await TypicalWeekRepository.destroy(id, {
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
    return TypicalWeekRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return TypicalWeekRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return TypicalWeekRepository.findAndCountAll(
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
    const count = await TypicalWeekRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
