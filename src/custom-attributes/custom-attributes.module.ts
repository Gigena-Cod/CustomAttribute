import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomAttributesController } from './Controller/custom-attributes.controller';
import { CustomAttributesService } from './Service/custom-attributes.service';
import { CustomAttributeSchema } from './Schemas/customAttribute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CustomAttribute', schema: CustomAttributeSchema },
    ]),
  ],
  controllers: [CustomAttributesController],
  providers: [CustomAttributesService],
})
export class CustomAttributesModule {}
