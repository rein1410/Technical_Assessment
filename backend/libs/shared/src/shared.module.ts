import { Global, Module } from '@nestjs/common';
import { ListQueryBuilder } from './helpers/list-query-builder';
import { SHARED_MODULE_OPTIONS } from './constants';

export type SharedModuleOptions = {
  apiOptions: {
    queryLimit: number;
  }
}

@Global()
@Module({})
export class SharedModule {
  static forRoot(options: SharedModuleOptions) {
    return {
      module: SharedModule,
      providers: [
        {
          provide: SHARED_MODULE_OPTIONS,
          useValue: options,
        },
        ListQueryBuilder,
      ],
      exports: [
        ListQueryBuilder,
      ],
    };
  }
}
