export interface CustomAtttribute {
  id: string;
  readOnly: boolean;
  visible: boolean;
  label: string;
  type: CustomAttributeType;
  data?: OptionValue[];
}

export interface OptionValue {
  label: string;
  value: string;
}

export enum CustomAttributeType {
  MULTI_SELECT = 'MULTI_SELECT',
  SINGLE_SELECT = 'SINGLE_SELECT',
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
}
