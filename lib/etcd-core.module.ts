import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import {
  EtcdModuleAsyncOptions,
  EtcdModuleOptions,
  EtcdOptionsFactory,
} from './interfaces';
import { ModuleRef } from '@nestjs/core';
import { ETCD_MODULE_OPTIONS } from './etcd.constants';
import { Etcd3, IOptions } from 'etcd3';
import { EtcdService } from './etcd.service';

@Global()
@Module({})
export class EtcdCoreModule {
  constructor(
    @Inject(ETCD_MODULE_OPTIONS)
    private readonly options: EtcdModuleOptions,
  ) {}

  static forRoot(options: EtcdModuleOptions = {}): DynamicModule {
    const etcdModuleOptions = {
      provide: ETCD_MODULE_OPTIONS,
      useValue: options,
    };

    const etcdClientProvider = {
      provide: Etcd3,
      useFactory: () => {
        return new Etcd3(options as IOptions);
      },
    };

    return {
      module: EtcdCoreModule,
      providers: [etcdModuleOptions, etcdClientProvider, EtcdService],
      exports: [etcdClientProvider, EtcdService],
    };
  }

  static forRootAsync(options: EtcdModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    const etcdClientProvider = {
      provide: Etcd3,
      useFactory: (etcdModuleOptions: EtcdModuleOptions) => {
        return new Etcd3(etcdModuleOptions as IOptions);
      },
      inject: [ETCD_MODULE_OPTIONS],
    };

    return {
      module: EtcdCoreModule, // EtcdModule diff?
      imports: [...(options.imports || [])],
      providers: [...asyncProviders, etcdClientProvider, EtcdService],
      exports: [etcdClientProvider, EtcdService],
    };
  }

  private static createAsyncProviders(
    options: EtcdModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<EtcdOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: EtcdModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ETCD_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<EtcdOptionsFactory>` is a workaround for microsoft/TypeScript#31603/#31937
    const inject = [
      (options.useClass || options.useExisting) as Type<EtcdOptionsFactory>,
    ];
    return {
      provide: ETCD_MODULE_OPTIONS,
      useFactory: async (optionsFactory: EtcdOptionsFactory) =>
        await optionsFactory.createEtcdOptions(),
      inject,
    };
  }
}
