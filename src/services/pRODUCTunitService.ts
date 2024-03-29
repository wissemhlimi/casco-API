import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import PRODUCTunitRepository from '../database/repositories/pRODUCTunitRepository';
import ProductRepository from '../database/repositories/productRepository';
import ProdurRepository from '../database/repositories/produrRepository';

export default class PRODUCTunitService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.prodId = await ProductRepository.filterIdInTenant(data.prodId, { ...this.options, session });
      data.produrId = await ProdurRepository.filterIdInTenant(data.produrId, { ...this.options, session });

      const record = await PRODUCTunitRepository.create(data, {
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
        'pRODUCTunit',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.prodId = await ProductRepository.filterIdInTenant(data.prodId, { ...this.options, session });
      data.produrId = await ProdurRepository.filterIdInTenant(data.produrId, { ...this.options, session });

      const record = await PRODUCTunitRepository.update(
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
        'pRODUCTunit',
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
        await PRODUCTunitRepository.destroy(id, {
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
    return PRODUCTunitRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PRODUCTunitRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PRODUCTunitRepository.findAndCountAll(
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
    const count = await PRODUCTunitRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
