import { merge } from 'lodash';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';

type ForeignTable<T extends object> = {
  [key in keyof T]: string | number;
};
class RepositoryUtils {
  /**
   * The function `getCols` takes a repository object and returns an array of column property names.
   * @param repository - The `repository` parameter is of type `Repository<T>`. It represents a
   * repository object that is used to access and manipulate data of type `T`.
   * @returns The function `getCols` returns an array of column property names from the metadata of the
   * provided repository. The type of the returned array is `(keyof T)[]`, which means it is an array
   * of keys that belong to the type `T`.
   */
  getCols<T extends object>(repository: Repository<T>) {
    return repository.metadata.columns.map(
      (col) => col.propertyName
    ) as (keyof T)[];
  }

  /**
   * The function `_saveStatisticScope` saves an array of statistic data to a repository, associating
   * each data with a scope using a foreign key.
   * @param {T[]} statisticData - An array of objects representing the statistic data to be saved.
   * @param repository - The `repository` parameter is an instance of the `Repository` class
   * @param {number} scopeId - The `scopeId` parameter is the ID of the scope to which the statistics
   * belong. It is used to set the foreign key value in the created entities.
   * @param {ForeignTable} foreignKey - The `foreignKey` parameter is a string that specifies
   * the foreign key relationship between the `statisticData` and the scope entity. It can have two
   * possible values: `'scope1'` or `'scope2'`.
   * @returns {Promise<T>}
   */
  public async saveListEntity<T extends object>(
    scopeDataList: T[],
    repository: Repository<T>,
    foreignKey?: Partial<ForeignTable<T>>
  ) {
    const scopeEntityList = repository.create(
      scopeDataList.map((e) => merge(e, foreignKey))
    );
    return await repository.save(scopeEntityList);
  }

  /**
   * The function saves an entity of type T to a repository.
   * @param {T} entity - The `entity` parameter is an object that represents the data you want to save
   * in the database. It can be any type of object as long as it extends the base `object` type.
   * @param repository - The `repository` parameter is an instance of the `Repository` class. It is used
   * to interact with the database and perform operations such as creating, updating, and deleting
   * entities. The `Repository` class is typically provided by an ORM (Object-Relational Mapping)
   * library, such as TypeORM
   * @returns a promise that resolves to the saved entity.
   */
  public async saveEntity<T extends object>(
    entity: T,
    repository: Repository<T>,
    foreignKey?: Partial<ForeignTable<T>>
  ) {
    const data = repository.create(merge(entity, foreignKey));
    return await repository.save(data);
  }

  public async findOneLatest<T extends object>(
    repository: Repository<T>,
    options?: FindOneOptions<T>
  ) {
    return repository.findOne(
      merge<FindOneOptions<T>, FindOneOptions<T>>(
        {
          where: {
            //@ts-ignore
            id: Not(IsNull()),
          },
          order: {
            //@ts-ignore
            createdAt: 'DESC',
          },
          cache: true,
        },
        options
      )
    );
  }
}

const repositoryUtils = new RepositoryUtils();

export default repositoryUtils;
