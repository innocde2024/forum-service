import { checkSchema, Location, ParamSchema } from 'express-validator';
export type NestedKeyOf<ObjectType extends Object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export class ValidateUtils {
  static checkSchema<DTO extends object>(
    schema: Partial<Record<NestedKeyOf<DTO>, ParamSchema>>,
    defaultLocations?: Location[]
  ) {
    //@ts-ignore
    return checkSchema(schema, defaultLocations);
  }
}
