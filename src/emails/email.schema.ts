import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

const EMAIL_TTL = process.env.EMAIL_TTL ? parseInt(process.env.EMAIL_TTL) : 900;

@Schema({ timestamps: true })
export class Email {
  @Prop({ required: true, unique: true })
  address: string;  // e.g., hahiba6551@datehype.com

  @Prop({ required: true })
  domain: string;   // e.g., datehype.com

  @Prop({ type: Array, default: [] })
  inbox: { 
    from: string; 
    subject: string; 
    body: string; 
    receivedAt: Date;
  }[];

  @Prop({ type: Date, default: () => new Date(), expires: EMAIL_TTL }) // TTL 15 min
  createdAt: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
