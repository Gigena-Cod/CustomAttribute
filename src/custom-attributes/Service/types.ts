import { CustomAttributeType, OptionValue } from '../custom-attribute.entity';

export interface CreateCustomAttributesProps {
  readOnly: boolean;
  visible: boolean;
  label: string;
  type: CustomAttributeType;
  newOptions?: string[];
}

export interface DeleteCustomAttributesProps {
  customsAttributeId: string;
}

export interface UpdateCustomAttributesProps
  extends CreateCustomAttributesProps {
  customsAttributeId: string;
}

export interface CustomAttributeResponse {
  id: string;
  type: string;
  readOnly: boolean;
  visible: boolean;
  label: string;
  data?: { label: string; value: string }[];
}

export interface CustomAttributeDTO
  extends Omit<CustomAttributeResponse, 'id'> {}

export interface CustomError {
  status: number;
  subcode: number;
  description: string;
}
