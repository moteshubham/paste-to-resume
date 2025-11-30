import Ajv from "ajv-draft-04";
import schema from "../types/jsonResumeSchema.json";

const ajv = new Ajv({ allErrors: true, strict: false });

const validate = ajv.compile(schema);

export function validateResume(data: any) {
  const valid = validate(data);
  return { valid, errors: validate.errors };
}
