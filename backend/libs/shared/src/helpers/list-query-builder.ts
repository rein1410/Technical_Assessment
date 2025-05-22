import { Inject, Injectable, Type } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { SharedModuleOptions } from '../shared.module';
import { ListQueryOptions, NullOptionals, SHARED_MODULE_OPTIONS, SortParameter } from '@app/shared';

type ListQueryBuilderOptions = {
  queryLimit: number;
};

@Injectable()
export class ListQueryBuilder {
  constructor(
    @Inject(SHARED_MODULE_OPTIONS) private options: SharedModuleOptions,
    private dataSource: DataSource,
  ) {}

  build<T extends ObjectLiteral>(
    entity: Type<T>,
    options: FindManyOptions<T> = {},
    ignoreQueryLimits: boolean = false,
  ): SelectQueryBuilder<T> {
    const repository = this.dataSource.getRepository(entity);
    const alias = entity.prototype.constructor.name.toLowerCase();
    const { take, skip } = this.parseTakeSkipParams(options, ignoreQueryLimits);
    const qb = repository.createQueryBuilder(alias);
    qb.setFindOptions({
      ...options,
      take,
      skip,
    });
    return qb;
  }

  private parseTakeSkipParams(
    options: ListQueryOptions<any>,
    ignoreQueryLimits: boolean = false,
  ) {
    const { queryLimit } = this.options.apiOptions;
    const takeLimit = ignoreQueryLimits ? Number.MAX_SAFE_INTEGER : queryLimit;
    const skip = Math.max(options.skip ?? 0, 0);
    let take =
      options.take == null
        ? takeLimit
        : Math.min(Math.max(options.take, 0), takeLimit);
    if (options.skip !== undefined && options.take === undefined) {
      take = takeLimit;
    }
    return { take, skip };
  }
}
