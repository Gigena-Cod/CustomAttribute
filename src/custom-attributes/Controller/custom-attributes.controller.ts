import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CustomAttributesService } from '../Service/custom-attributes.service';
import { CreateCustomAttributesProps } from '../Service/types';

@Controller('custom-attributes')
export class CustomAttributesController {
  constructor(private customAttributesService: CustomAttributesService) {}

  @Post()
  async createCustomAttributes(
    @Body() createCustomAttributesProps: CreateCustomAttributesProps,
    @Res() response,
  ) {
    const result = await this.customAttributesService.create(
      createCustomAttributesProps,
    );

    if (
      typeof result === 'object' &&
      'status' in result &&
      'subcode' in result &&
      'description' in result
    ) {
      return response.status(result.status).json({
        subcode: result.subcode,
        description: result.description,
      });
    }

    return response.status(HttpStatus.CREATED).json(result);
  }

  @Get()
  async getCustomAttributes(@Res() response) {
    const result = await this.customAttributesService.findAll();
    if (
      typeof result === 'object' &&
      'status' in result &&
      'subcode' in result &&
      'description' in result
    ) {
      return response.status(result.status).json({
        subcode: result.subcode,
        description: result.description,
      });
    }

    return response.status(HttpStatus.CREATED).json(result);
  }

  updateCustomsAttributes() {}

  @Delete(':id')
  async deleteCustomAttributes(
    @Param('id') customsAttributeId: string,
    @Res() response,
  ) {
    const result = await this.customAttributesService.delete({
      customsAttributeId,
    });

    if (
      typeof result === 'object' &&
      'status' in result &&
      'subcode' in result &&
      'description' in result
    ) {
      return response.status(result.status).json({
        subcode: result.subcode,
        description: result.description,
      });
    }

    return response.status(HttpStatus.OK).json(result);
  }
}
