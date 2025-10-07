import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageRole, ChatTool } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty({ enum: ChatMessageRole })
  @IsEnum(ChatMessageRole)
  role!: ChatMessageRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ enum: ChatTool, required: false, default: ChatTool.none })
  @IsOptional()
  @IsEnum(ChatTool)
  tool?: ChatTool;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  toolPayload?: Record<string, unknown>;
}
