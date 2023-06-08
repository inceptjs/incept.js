import type { SchemaConfig, SchemaColumn } from 'inceptjs';

export function getTypeName(schema: SchemaConfig) {
  return `${capitalize(schema.name)}Type`;
};

export function getTypeExtendedName(schema: SchemaConfig) {
  return schema.relations.length 
    ? `${capitalize(schema.name)}TypeExtended`
    : `${capitalize(schema.name)}Type`;
};

export function isRequired(field: SchemaColumn) {
  if (field.data.required) {
    return true;
  }
  for (const validation of field.validation) {
    if (validation.method === 'required') {
      return true;
    }
  }
  return false;
};

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatCode(code: string): string {
  code = code
    .replace(/\}\s+else\s+if\s+\(/g, '} else if (')
    .replace(/\s*\n\s*\n\s*/g, "\n")
    .trim();
  const lines = code.split("\n");
  let indent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^}/g) || line.match(/^\)/g)) {
      indent -= 2;
    }
    lines[i] = `${' '.repeat(indent)}${line}`;
    if (line.match(/\s*{\s*$/g) || line.match(/\s*\(\s*$/g)) {
      indent += 2;
    }
  }
  return lines.join("\n");
};

