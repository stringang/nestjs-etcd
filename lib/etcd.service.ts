import { Inject, Injectable } from '@nestjs/common';
import { EtcdModuleOptions } from './interfaces';
import { ETCD_MODULE_OPTIONS } from './etcd.constants';
import { Etcd3, Watcher } from 'etcd3';

@Injectable()
export class EtcdService {
  constructor(
    @Inject(ETCD_MODULE_OPTIONS) private readonly options: EtcdModuleOptions,
    private readonly client: Etcd3,
  ) {}

  async get(): Promise<{ [key: string]: string }> {
    return this.client.namespace(this.options.key || '').getAll();
  }

  async watch(): Promise<Watcher> {
    return this.client
      .namespace(this.options.key || '')
      .watch()
      .create();
  }
}
