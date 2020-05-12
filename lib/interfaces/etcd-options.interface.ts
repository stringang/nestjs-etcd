import { IOptions } from 'etcd3';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type EtcdModuleOptions = {
  key?: string;
} & Partial<IOptions>;

export interface EtcdOptionsFactory {
  createEtcdOptions(): Promise<EtcdModuleOptions> | EtcdModuleOptions;
}

export interface EtcdModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<EtcdOptionsFactory>;
  useClass?: Type<EtcdOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<EtcdModuleOptions> | EtcdModuleOptions;
  inject?: any[];
}
