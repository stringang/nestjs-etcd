import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import { EtcdModule } from '../../lib';
import { ConfigService } from '../src/config/config.service';
import { ConfigModule } from '../src/config/config.module';
import { Etcd3 } from 'etcd3';

describe('Etcd async configuration', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EtcdModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            return { ...configService.getEtcdOptions() };
          },
          inject: [ConfigService],
          imports: [ConfigModule],
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('should be defined', async function() {
    const etcdModule = app.get(EtcdModule);
    expect(etcdModule).toBeDefined();
  });

  it('should be get success', async function() {
    const etcdClient = app.get(Etcd3);
    etcdClient.mock({
      exec: jest
        .fn()
        .mockResolvedValue({ kvs: [{ key: '/ad', value: 'async-test' }] }),
    });
    const result = await etcdClient.get('/ad').string();
    expect(result).toBe('async-test');
    etcdClient.unmock();
  });

  afterEach(async done => {
    await app.close();
    done();
  });
});
