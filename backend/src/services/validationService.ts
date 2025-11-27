import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

const baseResumeSchema = {
  type: "object",
  properties: {
    basics: { type: "object" },
    work: { type: "array" },
    skills: { type: "array" },
    education: { type: "array" }
  },
  additionalProperties: true
};

const validate = ajv.compile(baseResumeSchema);

export const validateBaseResume = (data: any) => {
  const valid = validate(data);
  return { valid, errors: validate.errors };
};

