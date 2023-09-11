import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CustomAttributeType, OptionValue } from '../custom-attribute.entity';
import { OptionValueSchema } from './optionValue.schema';

@Schema()
export class CustomAttribute {
  @Prop({ required: true })
  readOnly: boolean;

  @Prop({ required: true })
  visible: boolean;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, enum: Object.values(CustomAttributeType) })
  type: string;

  @Prop({ required: false, type: [OptionValueSchema] })
  data?: OptionValue[];
}

export const CustomAttributeSchema =
  SchemaFactory.createForClass(CustomAttribute);

CustomAttributeSchema.pre('save', function (next) {
  if (!this.data || this.data.length === 0) {
    this.data = undefined;
  }
  next();
});

CustomAttributeSchema.set('versionKey', false);
 