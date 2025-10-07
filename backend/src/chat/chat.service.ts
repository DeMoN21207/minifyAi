import { Injectable } from '@nestjs/common';
import { ChatTool } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  createSession(userId: string) {
    return this.prisma.chatSession.create({
      data: {
        userId
      }
    });
  }

  listMessages(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });
  }

  async addMessage(sessionId: string, payload: CreateChatMessageDto) {
    const message = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: payload.role,
        content: payload.content,
        tool: payload.tool ?? ChatTool.none,
        toolPayload: payload.toolPayload ?? null
      }
    });
    return message;
  }
}
