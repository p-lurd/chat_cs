import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-guard.guard';
import { Role } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}


  @Post('create_account')
  @Role('admin')
  createSupport(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.createSupport(createSupportDto);
  }

  
  @Post('create_ticket')
  @Role('support', 'admin')
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.supportService.createTicket(createTicketDto);
  }

  @Get('tickets')
  @Role('support', 'admin')
  findAll() {
    return this.supportService.findAllTickets();
  }

  @Get('ticket/:id')
  @Role('support', 'admin')
  findOneTicket(@Param('id') id: string) {
    return this.supportService.findOneTicket(id);
  }

  @Patch('ticket/:id')
  @Role('support', 'admin')
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(id, updateSupportDto);
  }

  @Delete(':id')
  @Role('admin')
  remove(@Param('id') id: string) {
    return this.supportService.remove(+id);
  }
}
