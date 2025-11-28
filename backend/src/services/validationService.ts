import Ajv from "ajv";
import schema from "../types/jsonResumeSchema.json";

const ajv = new Ajv({ allErrors: true });

const validate = ajv.compile(schema);

export const validateResume = (data: any) => {
  const valid = validate(data);
  return { valid, errors: validate.errors };
};

