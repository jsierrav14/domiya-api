import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  @Get()
  check() {
    return {
      mongo:
        this.conn.readyState === ConnectionStates.connected
          ? 'connected'
          : 'not_connected',
    };
  }
}
