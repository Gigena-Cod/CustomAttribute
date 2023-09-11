import { Injectable } from '@nestjs/common';
import {
  CustomAtttribute,
  CustomAttributeType,
} from '../custom-attribute.entity';
import {
  CreateCustomAttributesProps,
  CustomAttributeDTO,
  CustomAttributeResponse,
  CustomError,
  DeleteCustomAttributesProps,
  UpdateCustomAttributesProps,
} from './types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomAttribute } from '../Schemas/customAttribute.schema';

@Injectable()
export class CustomAttributesService {
  constructor(
    @InjectModel('CustomAttribute')
    private customAttributeModel: Model<CustomAttribute>,
  ) {}

  async create(
    createCustomAttributesProps: CreateCustomAttributesProps,
  ): Promise<CustomAttributeResponse | CustomError> {
    try {
      const { label, readOnly, type, visible, newOptions, ...extraProps } =
        createCustomAttributesProps;

      const missingProperties = [];

      if (readOnly === undefined) {
        missingProperties.push('readOnly');
      }
      if (visible === undefined) {
        missingProperties.push('visible');
      }
      if (!label) {
        missingProperties.push('label');
      }
      if (!type) {
        missingProperties.push('type');
      }

      if (Object.keys(extraProps).length > 0) {
        return Promise.resolve({
          status: 400,
          subcode: 4001000,
          description:
            'Additional properties are not allowed: ' +
            Object.keys(extraProps).join(', '),
        });
      }

      if (missingProperties.length > 0) {
        return Promise.resolve({
          status: 400,
          subcode: 4001001,
          description: `The following properties are missing: ${missingProperties.join(
            ', ',
          )}`,
        });
      }

      if (typeof label !== 'string' || label.length > 50) {
        return Promise.resolve({
          status: 400,
          subcode: 4001002,
          description:
            'The label field must be a string with a maximum length of 50 characters',
        });
      }

      if (typeof readOnly !== 'boolean' || typeof visible !== 'boolean') {
        return Promise.resolve({
          status: 400,
          subcode: 4001003,
          description: 'The readOnly and visible fields must be booleans',
        });
      }

      const allowedTypes = Object.values(CustomAttributeType);

      if (!allowedTypes.includes(type)) {
        return Promise.resolve({
          status: 400,
          subcode: 400104,
          description:
            'The type field must be one of the allowed values: ' +
            allowedTypes.join(', '),
        });
      }

      const isDataEmpty =
        (type === CustomAttributeType.MULTI_SELECT ||
          type === CustomAttributeType.SINGLE_SELECT) &&
        newOptions &&
        newOptions.length === 0;

      if (isDataEmpty) {
        return Promise.resolve({
          status: 400,
          subcode: 4001005,
          description:
            'The custom attribute of type single select or multi select must have at least one option value',
        });
      }

      const hasEmptyOptions = newOptions?.some(
        (option) => option.trim() === '',
      );

      if (hasEmptyOptions) {
        return Promise.resolve({
          status: 400,
          subcode: 4001006,
          description: 'Options values cannot be empty',
        });
      }

      const createCustomAttributeDTO:  CustomAttributeDTO = {
        readOnly,
        visible,
        label,
        type,
      };

      if (
        type === CustomAttributeType.MULTI_SELECT ||
        type === CustomAttributeType.SINGLE_SELECT
      ) {
        const data = newOptions.map((option) => ({
          label: option,
          value: option.toLowerCase().replace(/\s/g, '_'),
        }));
        createCustomAttributeDTO.data = data;
      }

      const createdCustomAttribute = new this.customAttributeModel(
        createCustomAttributeDTO,
      );

      const savedCreatedCustomAttribute = await createdCustomAttribute.save();

      if (
        type === CustomAttributeType.MULTI_SELECT ||
        type === CustomAttributeType.SINGLE_SELECT
      ) {
        return {
          id: savedCreatedCustomAttribute._id.toString(),
          type: savedCreatedCustomAttribute.type,
          readOnly: savedCreatedCustomAttribute.readOnly,
          visible: savedCreatedCustomAttribute.visible,
          label: savedCreatedCustomAttribute.label,
          data: savedCreatedCustomAttribute.data,
        };
      }
      return {
        id: savedCreatedCustomAttribute._id.toString(),
        type: savedCreatedCustomAttribute.type,
        readOnly: savedCreatedCustomAttribute.readOnly,
        visible: savedCreatedCustomAttribute.visible,
        label: savedCreatedCustomAttribute.label,
      };
    } catch (error) {
      return Promise.resolve({
        status: 500,
        subcode: 5001000,
        description: 'There was an error when creating the CustomAttributes',
      });
    }
  }

  async findAll(): Promise<CustomAttribute[] | CustomError> {
    try {
      const customAttributes = await this.customAttributeModel.find().exec();

      const customAttributesDto = customAttributes.map((attribute) => {
        const customAttributes: CustomAttributeResponse = {
          id: attribute._id.toString(),
          type: attribute.type,
          readOnly: attribute.readOnly,
          visible: attribute.visible,
          label: attribute.label,
        };

        const isDataEmpty = attribute.data && attribute.data.length > 0;

        if (isDataEmpty) {
          customAttributes.data = attribute.data;
        }

        return customAttributes;
      });

      return customAttributesDto;
    } catch (error) {
      return {
        status: 500,
        subcode: 5002000,
        description: 'There was an error in obtaining the CustomAttributes',
      };
    }
  }

  async delete(
    deleteCustomAttributesProps: DeleteCustomAttributesProps,
  ): Promise<CustomAttribute | CustomError> {
    try {
      const { customsAttributeId } = deleteCustomAttributesProps;

      const deletedCustomAttribute = await this.customAttributeModel
        .findByIdAndDelete(customsAttributeId)
        .exec();

      if (!deletedCustomAttribute) {
        return {
          status: 404,
          subcode: 4043000,
          description: `No custom attribute found with ID ${customsAttributeId}.`,
        };
      }

      return deletedCustomAttribute;
    } catch (error) {
      return {
        status: 500,
        subcode: 5003000,
        description: 'There was an error deleting the custom attribute',
      };
    }
  }

  updateCustomAttributes(
    updateCustomAttributesProps: UpdateCustomAttributesProps,
  ) {
    const {} = updateCustomAttributesProps;
  }
}
