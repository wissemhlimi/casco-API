import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import PlanningRepository from '../database/repositories/planningRepository';
import ConfigTableRepository from '../database/repositories/configTableRepository';

export default class PlanningService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.config =
        await ConfigTableRepository.filterIdInTenant(
          data.config,
          { ...this.options, session },
        );
      data.editable =
        await PlanningRepository.filterIdInTenant(
          data.editable,
          { ...this.options, session },
        );

      const record = await PlanningRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'planning',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.config =
        await ConfigTableRepository.filterIdInTenant(
          data.config,
          { ...this.options, session },
        );
      data.editable =
        await PlanningRepository.filterIdInTenant(
          data.editable,
          { ...this.options, session },
        );

      const record = await PlanningRepository.update(
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
        'planning',
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
        await PlanningRepository.destroy(id, {
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
    return PlanningRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PlanningRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PlanningRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async sendByEmail(args) {
    return PlanningRepository.sendByEmail(
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
    const count = await PlanningRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
