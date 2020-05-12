import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import { EtcdModule } from '../../lib';
import { ConfigService } from '../src/config.service';
import { ConfigModule } from '../src/config.module';

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

  afterEach(async () => {
    await app.close();
  });
});
