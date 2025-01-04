import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post('')
  async processPayment(@Body() body: any) {
    console.log(body);
    return { ok: true };
  }
}
