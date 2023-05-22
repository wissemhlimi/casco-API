import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import PRODUCTlineRepository from '../database/repositories/pRODUCTlineRepository';
import ProductRepository from '../database/repositories/productRepository';
import ProdlineRepository from '../database/repositories/prodlineRepository';

export default class PRODUCTlineService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.pRODlinePRODID = await ProductRepository.filterIdInTenant(data.pRODlinePRODID, { ...this.options, session });
      data.pRODlineLINEID = await ProdlineRepository.filterIdsInTenant(data.pRODlineLINEID, { ...this.options, session });

      const record = await PRODUCTlineRepository.create(data, {
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
        'pRODUCTline',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.pRODlinePRODID = await ProductRepository.filterIdInTenant(data.pRODlinePRODID, { ...this.options, session });
      data.pRODlineLINEID = await ProdlineRepository.filterIdsInTenant(data.pRODlineLINEID, { ...this.options, session });

      const record = await PRODUCTlineRepository.update(
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
        'pRODUCTline',
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
        await PRODUCTlineRepository.destroy(id, {
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
    return PRODUCTlineRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PRODUCTlineRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PRODUCTlineRepository.findAndCountAll(
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
    const count = await PRODUCTlineRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
