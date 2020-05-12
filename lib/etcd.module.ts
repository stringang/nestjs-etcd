import { DynamicModule, Global, Module } from '@nestjs/common';
import { EtcdCoreModule } from './etcd-core.module';
import { EtcdModuleAsyncOptions, EtcdModuleOptions } from './interfaces';

@Module({})
export class EtcdModule {
  static forRoot(options?: EtcdModuleOptions): DynamicModule {
    return {
      module: EtcdModule,
      imports: [EtcdCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: EtcdModuleAsyncOptions): DynamicModule {
    return {
      module: EtcdModule,
      imports: [EtcdCoreModule.forRootAsync(options)],
    };
  }
}
