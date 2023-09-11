import { Module } from '@nestjs/common';
import { CustomAttributesModule } from './custom-attributes/custom-attributes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CustomAttributesModule,
    MongooseModule.forRoot(
      'mongodb+srv://Destroxides:1590171974Destro@cluster0.wjyc1.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
