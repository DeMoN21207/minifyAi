import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  createSession(@Body() payload: CreateChatSessionDto) {
    return this.chatService.createSession(payload.userId);
  }

  @Get('sessions/:id/messages')
  listMessages(@Param('id') id: string) {
    return this.chatService.listMessages(id);
  }

  @Post('sessions/:id/messages')
  addMessage(@Param('id') id: string, @Body() payload: CreateChatMessageDto) {
    return this.chatService.addMessage(id, payload);
  }
}
