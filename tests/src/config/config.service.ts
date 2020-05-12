import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getEtcdOptions(): object {
    return {
      key: '/ad/place',
      hosts: '127.0.0.1:2379',
      grpcOptions: { 'grpc.max_receive_message_length': 8 * 1024 * 1024 },
    };
  }
}
