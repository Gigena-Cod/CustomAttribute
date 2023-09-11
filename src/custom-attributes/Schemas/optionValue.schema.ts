import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OptionValue {
  @Prop()
  label: string;

  @Prop()
  value: string;
}

export const OptionValueSchema = SchemaFactory.createForClass(OptionValue);
