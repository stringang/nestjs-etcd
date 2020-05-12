import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import { EtcdModule } from '../../lib';
import { Etcd3 } from 'etcd3';

describe('Etcd module', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EtcdModule.forRoot({
          key: '/ad/place',
          hosts: '127.0.0.1:2379',
          grpcOptions: { 'grpc.max_receive_message_length': 8 * 1024 * 1024 },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('should be defined ', async function() {
    const etcdModule = app.get(EtcdModule);
    expect(etcdModule).toBeDefined();
  });

  it('should be put success', async function() {
    const etcdClient = app.get(Etcd3);
    const result = await etcdClient.put('/ad').value('test');

    expect(result).toBeDefined();
  });

  it('should be get success', async function() {
    const etcdClient = app.get(Etcd3);
    const result = await etcdClient.get('/ad');
    expect(result).toBe('test');
  });

  afterEach(async () => {
    await app.close();
  });
});
