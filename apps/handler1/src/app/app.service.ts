import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): string {
    console.log('Welcome to handler1!');
    return 'Welcome to handler1!';
  }
}
