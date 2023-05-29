import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import SpecialCalendarRepository from '../database/repositories/specialCalendarRepository';
import CalendarMainRepository from '../database/repositories/calendarMainRepository';

export default class SpecialCalendarService {
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

      const record = await SpecialCalendarRepository.create(
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
        'specialCalendar',
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

      const record = await SpecialCalendarRepository.copy(
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
        'specialCalendar',
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

      const record = await SpecialCalendarRepository.update(
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
        'specialCalendar',
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
        await SpecialCalendarRepository.destroy(id, {
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
    return SpecialCalendarRepository.findById(
      id,
      this.options,
    );
  }

  async findAllAutocomplete(search, limit) {
    return SpecialCalendarRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return SpecialCalendarRepository.findAndCountAll(
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
    const count = await SpecialCalendarRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
