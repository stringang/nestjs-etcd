# NestJS-etcd

## Installation

```bash
$ npm i --save @nestjs/etcd etcd3
```

## Quick Start

```text
@Injectable()
export class exampleService {
  // inject
  constructor(private readonly client: Etcd3) {}
  
  async get(): Promise<{ [key: string]: string }> {
    return this.client.namespace(this.options.key || '').getAll();
  }
}
```