var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage2 = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage2 = map(fullIssue, { data, defaultError: errorMessage2 }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage2
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/shared/modules.ts
var MODULE_KEYS = [
  "sceneKernel",
  "deltas",
  "meters",
  "castCore",
  "castVisuals",
  "clothing",
  "relationships",
  "inventory",
  "worldSpace",
  "storyThreads",
  "continuity",
  "secretsRumors",
  "actionResolver",
  "dialogueState",
  "directorStyle",
  "closenessState",
  "imagePrompt",
  "auditLog"
];
var CORE_TRACKING_MODULES = /* @__PURE__ */ new Set([
  "sceneKernel",
  "deltas",
  "castCore",
  "storyThreads",
  "continuity"
]);
var MODULE_CATALOG = [
  { key: "sceneKernel", label: "Scene Kernel", group: "Core", description: "Scene, time, tone, focus, objective, and constraints." },
  { key: "deltas", label: "Turn Deltas", group: "Core", description: "Meaningful changes from the previous compiled state." },
  { key: "meters", label: "Diagnostic Meters", group: "Scene", description: "Tension, danger, coherence, hidden information, and omen." },
  { key: "castCore", label: "Cast Core", group: "Cast", description: "Presence, intent, status, awareness, goals, and anchors." },
  { key: "castVisuals", label: "Cast Visuals", group: "Cast", description: "Pose, proximity, hands, visual anchor, and spotlight." },
  { key: "clothing", label: "Clothing", group: "Cast", description: "Compact grounded clothing continuity." },
  { key: "relationships", label: "Relationships", group: "Cast", description: "Relationship state, leverage, and social pressure." },
  { key: "inventory", label: "Inventory", group: "World", description: "Pockets, ownership, condition, and important room items." },
  { key: "worldSpace", label: "World & Space", group: "World", description: "Privacy, observers, light, blocking, exits, and hazards." },
  { key: "storyThreads", label: "Story Threads", group: "Story", description: "Goals, conflicts, threads, stakes, countdowns, and autonomy." },
  { key: "continuity", label: "Continuity Firewall", group: "Story", description: "Facts, anchors, consequences, impossible moves, and risks." },
  { key: "secretsRumors", label: "Secrets & Rumors", group: "World", description: "Rumors, secrets, hints, and loaded signs." },
  { key: "actionResolver", label: "Action Resolver", group: "Tools", description: "Current action, world response, blockers, and risk." },
  { key: "dialogueState", label: "Dialogue State", group: "Tools", description: "Open thread, masks, levers, and taboos." },
  { key: "directorStyle", label: "Director Style", group: "Tools", description: "Optional scene direction and voice cues." },
  { key: "closenessState", label: "Closeness State", group: "Tools", description: "Non-explicit emotional and physical closeness." },
  { key: "imagePrompt", label: "Image Prompt", group: "Tools", description: "Optional compact visual prompt assembly." },
  { key: "auditLog", label: "Audit Log", group: "System", description: "Compact compiler and repair diagnostics." }
];
function control(track, display = track, inject = false) {
  return { track, display, inject };
}
var BALANCED_MODULE_SETTINGS = {
  sceneKernel: control(true, true, true),
  deltas: control(true, true, true),
  meters: control(true, true, false),
  castCore: control(true, true, true),
  castVisuals: control(true, true, false),
  clothing: control(true, true, false),
  relationships: control(true, true, true),
  inventory: control(true, true, true),
  worldSpace: control(true, true, true),
  storyThreads: control(true, true, true),
  continuity: control(true, true, true),
  secretsRumors: control(true, true, false),
  actionResolver: control(true, true, true),
  dialogueState: control(false, false, false),
  directorStyle: control(false, false, false),
  closenessState: control(false, false, false),
  imagePrompt: control(false, false, false),
  auditLog: control(true, true, false)
};
function cloneControls(source) {
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [key, { ...source[key] }])
  );
}
function normalizeModuleSettings(input) {
  const next = cloneControls(BALANCED_MODULE_SETTINGS);
  for (const key of MODULE_KEYS) {
    const candidate = input?.[key];
    if (candidate) {
      next[key] = {
        track: typeof candidate.track === "boolean" ? candidate.track : next[key].track,
        display: typeof candidate.display === "boolean" ? candidate.display : next[key].display,
        inject: typeof candidate.inject === "boolean" ? candidate.inject : next[key].inject
      };
    }
    if (CORE_TRACKING_MODULES.has(key)) {
      next[key].track = true;
    }
  }
  return next;
}
function trackedModuleKeys(settings) {
  return MODULE_KEYS.filter((key) => settings.moduleSettings[key].track);
}

// src/shared/schemas.ts
var LoomOSSkinSchema = external_exports.enum([
  "auto",
  "dark_academia",
  "cyberpunk",
  "fantasy",
  "horror",
  "noir",
  "minimal"
]);
var AutoGenerationModeSchema = external_exports.enum([
  "off",
  "assistant",
  "every",
  "manual"
]);
var ModulePresetSchema = external_exports.string();
var ModuleKeySchema = external_exports.enum(MODULE_KEYS);
var ModuleControlSchema = external_exports.object({
  track: external_exports.boolean(),
  display: external_exports.boolean(),
  inject: external_exports.boolean()
}).strict();
var ModuleSettingsSchema = external_exports.object(
  Object.fromEntries(
    MODULE_KEYS.map((key) => [key, ModuleControlSchema])
  )
).strict();
var CustomModulePresetSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  description: external_exports.string().trim().max(500).default(""),
  createdAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  moduleSettings: ModuleSettingsSchema
}).strict();
var CustomModuleSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  label: external_exports.string().trim().min(1).max(160),
  group: external_exports.string().trim().min(1).max(160).default("Custom"),
  description: external_exports.string().trim().max(500).default(""),
  enabled: external_exports.boolean().default(true),
  display: external_exports.boolean().default(true),
  inject: external_exports.boolean().default(true),
  compilerInstruction: external_exports.string().trim().max(1600),
  outputMode: external_exports.enum(["cards", "bullets", "chips", "gauge"]).default("cards"),
  maxItems: external_exports.number().int().min(1).max(24).default(6)
}).strict();
var StateIdentitySchema = external_exports.object({
  chatId: external_exports.string().min(1).max(300),
  messageId: external_exports.string().min(1).max(300),
  swipeId: external_exports.number().int().nonnegative()
}).strict();
var StateHistoryItemSchema = external_exports.object({
  identity: StateIdentitySchema,
  generatedAt: external_exports.string(),
  schemaVersion: external_exports.number().int(),
  kernelScene: external_exports.string(),
  kernelFocus: external_exports.string(),
  kernelLocation: external_exports.string(),
  kernelTime: external_exports.string(),
  deltaHeadline: external_exports.string(),
  castCount: external_exports.number().int(),
  threadCount: external_exports.number().int(),
  riskCount: external_exports.number().int(),
  repaired: external_exports.boolean(),
  seedIdentity: StateIdentitySchema.nullable(),
  activeModuleCount: external_exports.number().int()
}).strict();
var RawSettingsSchema = external_exports.object({
  schemaVersion: external_exports.literal(2).default(2),
  skin: LoomOSSkinSchema.default("auto"),
  autoGeneration: AutoGenerationModeSchema.default("manual"),
  injectionEnabled: external_exports.boolean().default(false),
  showInjectionPreview: external_exports.boolean().default(false),
  injectionTokenBudget: external_exports.number().int().min(80).max(1600).default(320),
  compilerSeedTokenBudget: external_exports.number().int().min(200).max(2400).default(900),
  recentMessageLimit: external_exports.number().int().min(4).max(80).default(24),
  generationTimeoutSeconds: external_exports.number().int().min(30).max(300).default(180),
  connectionId: external_exports.string().trim().max(200).default(""),
  modulePreset: ModulePresetSchema.default("balanced"),
  moduleSettings: ModuleSettingsSchema.default(BALANCED_MODULE_SETTINGS),
  customModulePresets: external_exports.array(CustomModulePresetSchema).default([]),
  customModules: external_exports.array(CustomModuleSchema).default([])
}).strict();
function settingsInput(value) {
  if (typeof value !== "object" || value === null) return value;
  const source = value;
  const legacyPanels = typeof source.panels === "object" && source.panels !== null ? source.panels : {};
  const suppliedModules = typeof source.moduleSettings === "object" && source.moduleSettings !== null ? source.moduleSettings : void 0;
  const moduleSettings = normalizeModuleSettings(suppliedModules);
  const panelMap = {
    kernel: "sceneKernel",
    castMatrix: "castCore",
    threadLoom: "storyThreads",
    continuityFirewall: "continuity"
  };
  for (const [oldKey, newKey] of Object.entries(panelMap)) {
    if (typeof legacyPanels[oldKey] === "boolean" && !suppliedModules?.[newKey]) {
      moduleSettings[newKey].display = legacyPanels[oldKey];
    }
  }
  for (const key of CORE_TRACKING_MODULES) {
    moduleSettings[key].track = true;
  }
  return {
    schemaVersion: 2,
    skin: source.skin,
    autoGeneration: source.autoGeneration,
    injectionEnabled: source.injectionEnabled,
    showInjectionPreview: source.showInjectionPreview,
    injectionTokenBudget: source.injectionTokenBudget,
    compilerSeedTokenBudget: source.compilerSeedTokenBudget,
    recentMessageLimit: source.recentMessageLimit,
    generationTimeoutSeconds: source.generationTimeoutSeconds,
    connectionId: source.connectionId,
    modulePreset: source.modulePreset,
    moduleSettings,
    customModulePresets: source.customModulePresets,
    customModules: source.customModules
  };
}
var LoomOSSettingsSchema = external_exports.preprocess(settingsInput, RawSettingsSchema);
var ShortText = external_exports.string().trim().max(500);
var MediumText = external_exports.string().trim().max(1600);
var TinyText = external_exports.string().trim().max(160);
var PercentText = external_exports.string().trim().max(12);
var ColorText = external_exports.string().trim().max(40);
var TrendSchema = external_exports.enum(["down", "steady", "up", "unknown"]);
var GaugeSchema = external_exports.object({
  value: external_exports.number().min(0).max(100),
  pct: PercentText,
  band: TinyText,
  color: ColorText,
  trend: TrendSchema,
  note: ShortText
}).strict();
var KernelSchema = external_exports.object({
  scene: ShortText,
  location: ShortText,
  timeframe: ShortText,
  date: ShortText,
  time: ShortText,
  elapsed: ShortText,
  weather: ShortText,
  pov: ShortText,
  tone: ShortText,
  topic: ShortText,
  theme: ShortText,
  objective: MediumText,
  summary: MediumText,
  currentFocus: MediumText,
  nextFocus: MediumText,
  currentRisk: MediumText,
  stopMode: ShortText,
  stopWhy: MediumText,
  constraints: external_exports.array(ShortText).max(12)
}).strict();
var DeltaSchema = external_exports.object({
  headline: MediumText,
  changedModules: external_exports.array(ModuleKeySchema).max(MODULE_KEYS.length),
  changes: external_exports.array(external_exports.object({
    text: MediumText,
    age: ShortText,
    module: ModuleKeySchema,
    importance: external_exports.enum(["low", "medium", "high", "critical"])
  }).strict()).max(6),
  carriedForward: external_exports.array(MediumText).max(6),
  newlyEstablished: external_exports.array(MediumText).max(6)
}).strict();
var MeterSchema = GaugeSchema.extend({
  id: external_exports.enum(["tension", "danger", "socialHeat", "coherence", "hiddenInfo", "omen"]),
  label: TinyText
}).strict();
var SceneItemSchema = external_exports.object({
  name: TinyText,
  owner: TinyText,
  location: ShortText,
  condition: ShortText,
  lastTouch: ShortText,
  importance: external_exports.enum(["low", "medium", "high", "critical"])
}).strict();
var SceneSchema = external_exports.object({
  privacy: external_exports.enum(["private", "semi-private", "public", "exposed"]),
  observerCount: external_exports.number().int().nonnegative().max(1e4),
  observerPressure: GaugeSchema.omit({ value: true }).extend({
    value: external_exports.number().min(0).max(10)
  }).strict(),
  crowdNoise: ShortText,
  crowdFlow: ShortText,
  light: external_exports.object({
    primary: ShortText,
    secondary: ShortText,
    quality: ShortText,
    color: ColorText
  }).strict(),
  spatial: external_exports.array(MediumText).max(8),
  access: external_exports.object({
    exit: external_exports.enum(["FREE", "WATCHED", "BLOCKED"]),
    lineOfSight: ShortText,
    noiseMask: ShortText,
    items: external_exports.array(ShortText).max(5),
    people: external_exports.array(ShortText).max(5)
  }).strict(),
  carryover: external_exports.object({
    body: external_exports.array(ShortText).max(5),
    room: external_exports.array(ShortText).max(5),
    social: external_exports.array(ShortText).max(5)
  }).strict(),
  items: external_exports.array(SceneItemSchema).max(10)
}).strict();
var PocketItemSchema = external_exports.object({
  name: TinyText,
  type: TinyText,
  qty: external_exports.number().int().nonnegative().max(9999),
  condition: ShortText,
  known: external_exports.boolean()
}).strict();
var CastMemberSchema = external_exports.object({
  id: external_exports.string().trim().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  kind: external_exports.enum(["pov", "main", "npc", "crowd", "background"]),
  qty: external_exports.number().int().positive().max(1e4),
  role: ShortText,
  location: ShortText,
  status: ShortText,
  emotionalState: ShortText,
  intent: MediumText,
  pose: ShortText,
  proximity: ShortText,
  hands: ShortText,
  awareness: external_exports.enum(["none", "ambient", "watching", "alerted", "hostile"]),
  threat: GaugeSchema.omit({ value: true, trend: true }).extend({
    value: external_exports.number().min(0).max(10)
  }).strict(),
  spotlight: GaugeSchema,
  visualAnchor: MediumText,
  identitySummary: MediumText,
  clothingSummary: MediumText,
  goals: external_exports.array(ShortText).max(6),
  relationships: external_exports.array(ShortText).max(8),
  leverage: external_exports.array(ShortText).max(6),
  pockets: external_exports.array(PocketItemSchema).max(6),
  stableFacts: external_exports.array(ShortText).max(6)
}).strict();
var WorldStateSchema = external_exports.object({
  recentEnvironmentalChanges: external_exports.array(MediumText).max(6),
  activeHazards: external_exports.array(MediumText).max(6),
  rumors: external_exports.array(external_exports.object({
    rumor: MediumText,
    source: ShortText,
    credibility: external_exports.number().min(0).max(10),
    pct: PercentText,
    color: ColorText
  }).strict()).max(8),
  secrets: external_exports.array(external_exports.object({
    secret: MediumText,
    visibleHint: MediumText,
    knownBy: external_exports.array(TinyText).max(6)
  }).strict()).max(8),
  loadedSigns: external_exports.array(external_exports.object({
    thing: ShortText,
    loadedBy: MediumText,
    firesWhen: MediumText,
    state: external_exports.enum(["LOADED", "HEATING", "FIRED", "DORMANT"])
  }).strict()).max(8)
}).strict();
var StoryThreadSchema = external_exports.object({
  title: external_exports.string().trim().min(1).max(240),
  status: external_exports.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
  urgency: external_exports.number().int().min(0).max(5),
  priority: external_exports.enum(["low", "medium", "high", "critical"]),
  progress: external_exports.number().min(0).max(10),
  pct: PercentText,
  color: ColorText,
  label: TinyText,
  summary: MediumText,
  nextPressure: MediumText,
  participants: external_exports.array(TinyText).max(12)
}).strict();
var StoryStateSchema = external_exports.object({
  goals: external_exports.array(external_exports.object({
    who: TinyText,
    goal: MediumText,
    status: external_exports.enum(["ACTIVE", "BLOCKED", "PROGRESSED", "RESOLVED"]),
    note: MediumText
  }).strict()).max(10),
  conflicts: external_exports.array(external_exports.object({
    a: TinyText,
    b: TinyText,
    label: ShortText,
    severity: external_exports.number().int().min(1).max(3)
  }).strict()).max(8),
  threadLoom: external_exports.array(StoryThreadSchema).max(24),
  stakes: external_exports.array(external_exports.object({
    who: TinyText,
    win: MediumText,
    lose: MediumText
  }).strict()).max(8),
  countdowns: external_exports.array(external_exports.object({
    title: ShortText,
    left: external_exports.number().nonnegative(),
    unit: TinyText,
    pct: PercentText,
    color: ColorText
  }).strict()).max(8),
  autonomyQueue: external_exports.array(external_exports.object({
    who: TinyText,
    action: MediumText,
    unlessInterruptedBy: MediumText
  }).strict()).max(8)
}).strict();
var ContinuityRiskSchema = external_exports.object({
  severity: external_exports.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText
}).strict();
var ContinuityFirewallSchema = external_exports.object({
  establishedFacts: external_exports.array(MediumText).max(40),
  antiRetconAnchors: external_exports.array(MediumText).max(30),
  pendingConsequences: external_exports.array(MediumText).max(30),
  offscreenState: external_exports.array(MediumText).max(24),
  bannedNext: external_exports.array(external_exports.object({
    text: MediumText,
    persistent: external_exports.boolean()
  }).strict()).max(12),
  impossibleNext: external_exports.array(MediumText).max(12),
  risks: external_exports.array(ContinuityRiskSchema).max(24)
}).strict();
var ToolsSchema = external_exports.object({
  actionResolver: external_exports.object({
    userAction: MediumText,
    worldResponse: MediumText,
    risk: MediumText,
    blockers: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  dialogueState: external_exports.object({
    openThread: MediumText,
    socialMask: MediumText,
    levers: external_exports.array(ShortText).max(6),
    taboos: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  directorStyle: external_exports.object({
    primary: ShortText,
    mask: ShortText,
    push: MediumText,
    voiceCues: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  closenessState: external_exports.object({
    emotional: ShortText,
    physical: ShortText,
    consentSignals: external_exports.array(ShortText).max(6),
    boundaries: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  imagePrompt: external_exports.object({
    aspect: TinyText,
    shot: ShortText,
    medium: ShortText,
    subject: MediumText,
    positive: MediumText,
    negative: MediumText,
    full: external_exports.string().trim().max(3e3),
    hint: MediumText
  }).strict().nullable()
}).strict();
var AuditEntrySchema = external_exports.object({
  system: TinyText,
  marker: TinyText,
  result: ShortText,
  repaired: external_exports.boolean(),
  notes: MediumText
}).strict();
var CustomModuleItemSchema = external_exports.object({
  title: ShortText,
  text: MediumText,
  importance: external_exports.enum(["low", "medium", "high", "critical"]),
  color: ColorText.optional()
}).strict();
var CustomModuleDataSchema = external_exports.object({
  moduleId: external_exports.string().min(1).max(160),
  label: ShortText,
  summary: MediumText.default(""),
  items: external_exports.array(CustomModuleItemSchema).max(24).default([])
}).strict();
var LoomOSCompiledStateSchema = external_exports.object({
  activeModules: external_exports.array(ModuleKeySchema).max(MODULE_KEYS.length),
  kernel: KernelSchema,
  delta: DeltaSchema,
  meters: external_exports.array(MeterSchema).max(6).default([]),
  scene: SceneSchema.nullable().default(null),
  castMatrix: external_exports.array(CastMemberSchema).max(24),
  worldState: WorldStateSchema.nullable().default(null),
  storyState: StoryStateSchema,
  continuityFirewall: ContinuityFirewallSchema,
  tools: ToolsSchema.default({
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null
  }),
  auditLog: external_exports.array(AuditEntrySchema).max(12).default([]),
  customModuleData: external_exports.array(CustomModuleDataSchema).default([])
}).strict();
var LoomOSStateSchema = LoomOSCompiledStateSchema.extend({
  schemaVersion: external_exports.literal(2),
  identity: StateIdentitySchema,
  generatedAt: external_exports.string().datetime(),
  source: external_exports.object({
    messageCount: external_exports.number().int().nonnegative(),
    repaired: external_exports.boolean(),
    seedIdentity: StateIdentitySchema.nullable(),
    connectionId: external_exports.string().max(200)
  }).strict()
}).strict();
var LegacyLoomOSStateSchema = external_exports.object({
  schemaVersion: external_exports.literal(1),
  identity: StateIdentitySchema,
  generatedAt: external_exports.string().datetime(),
  source: external_exports.object({
    messageCount: external_exports.number().int().nonnegative(),
    repaired: external_exports.boolean()
  }).strict(),
  kernel: external_exports.object({
    scene: ShortText,
    location: ShortText,
    timeframe: ShortText,
    tone: ShortText,
    objective: MediumText,
    summary: MediumText,
    constraints: external_exports.array(ShortText).max(12)
  }).strict(),
  castMatrix: external_exports.array(external_exports.object({
    name: external_exports.string().trim().min(1).max(160),
    role: ShortText,
    status: ShortText,
    location: ShortText,
    emotionalState: ShortText,
    goals: external_exports.array(ShortText).max(8),
    relationships: external_exports.array(ShortText).max(10),
    leverage: external_exports.array(ShortText).max(8)
  }).strict()).max(24),
  threadLoom: external_exports.array(external_exports.object({
    title: external_exports.string().trim().min(1).max(240),
    status: external_exports.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
    urgency: external_exports.number().int().min(0).max(5),
    summary: MediumText,
    nextPressure: MediumText,
    participants: external_exports.array(TinyText).max(12)
  }).strict()).max(24),
  continuityFirewall: external_exports.object({
    establishedFacts: external_exports.array(MediumText).max(30),
    pendingConsequences: external_exports.array(MediumText).max(24),
    secrets: external_exports.array(MediumText).max(24),
    risks: external_exports.array(ContinuityRiskSchema).max(24)
  }).strict()
}).strict();
var DEFAULT_SETTINGS = LoomOSSettingsSchema.parse({});

// src/shared/prompts.ts
var CORE_CONTRACT = `
Always return these top-level keys:
- activeModules: enabled module keys actually represented
- kernel: scene/location/time/tone/focus/objective/summary/risk/constraints
- delta: headline, changedModules, up to 6 changes, carriedForward, newlyEstablished
- castMatrix: compact cast records
- storyState: goals, conflicts, threadLoom, stakes, countdowns, autonomyQueue
- continuityFirewall: facts, anchors, consequences, offscreen state, banned/impossible next, risks

Return optional module containers only through their stable top-level locations:
- meters: diagnostic meter array
- scene: privacy, observers, light, spatial/access/carryover/items
- worldState: environmental changes, hazards, rumors, secrets, loaded signs
- tools: actionResolver, dialogueState, directorStyle, closenessState, imagePrompt
- auditLog: compact compiler audit entries

For disabled optional modules use [] or null as appropriate. Never omit required
core objects. Every object and array must match the supplied contract names.`;
var STATE_SHAPE_GUIDE = `
Exact JSON field contract (values below are type examples, not story facts):
{
  "activeModules": ["sceneKernel"],
  "kernel": {
    "scene": "", "location": "", "timeframe": "", "date": "", "time": "",
    "elapsed": "", "weather": "", "pov": "", "tone": "", "topic": "",
    "theme": "", "objective": "", "summary": "", "currentFocus": "",
    "nextFocus": "", "currentRisk": "", "stopMode": "", "stopWhy": "",
    "constraints": []
  },
  "delta": {
    "headline": "", "changedModules": [],
    "changes": [{"text":"","age":"","module":"deltas","importance":"medium"}],
    "carriedForward": [], "newlyEstablished": []
  },
  "meters": [{
    "id": "tension", "label": "Tension", "value": 0, "pct": "0%",
    "band": "", "color": "", "trend": "unknown", "note": ""
  }],
  "scene": {
    "privacy": "private", "observerCount": 0,
    "observerPressure": {
      "value": 0, "pct": "0%", "band": "", "color": "",
      "trend": "unknown", "note": ""
    },
    "crowdNoise": "", "crowdFlow": "",
    "light": {"primary":"","secondary":"","quality":"","color":""},
    "spatial": [],
    "access": {
      "exit": "FREE", "lineOfSight": "", "noiseMask": "",
      "items": [], "people": []
    },
    "carryover": {"body":[],"room":[],"social":[]},
    "items": [{
      "name":"","owner":"","location":"","condition":"","lastTouch":"",
      "importance":"medium"
    }]
  },
  "castMatrix": [{
    "id":"","name":"","kind":"npc","qty":1,"role":"","location":"",
    "status":"","emotionalState":"","intent":"","pose":"","proximity":"",
    "hands":"","awareness":"ambient",
    "threat":{"value":0,"pct":"0%","band":"","color":"","note":""},
    "spotlight":{
      "value":0,"pct":"0%","band":"","color":"",
      "trend":"unknown","note":""
    },
    "visualAnchor":"","identitySummary":"","clothingSummary":"",
    "goals":[],"relationships":[],"leverage":[],"pockets":[],
    "stableFacts":[]
  }],
  "worldState": {
    "recentEnvironmentalChanges":[],"activeHazards":[],
    "rumors":[{"rumor":"","source":"","credibility":0,"pct":"0%","color":""}],
    "secrets":[{"secret":"","visibleHint":"","knownBy":[]}],
    "loadedSigns":[{"thing":"","loadedBy":"","firesWhen":"","state":"DORMANT"}]
  },
  "storyState": {
    "goals":[{"who":"","goal":"","status":"ACTIVE","note":""}],
    "conflicts":[{"a":"","b":"","label":"","severity":1}],
    "threadLoom":[{
      "title":"","status":"active","urgency":0,"priority":"medium",
      "progress":0,"pct":"0%","color":"","label":"","summary":"",
      "nextPressure":"","participants":[]
    }],
    "stakes":[{"who":"","win":"","lose":""}],
    "countdowns":[{"title":"","left":0,"unit":"","pct":"0%","color":""}],
    "autonomyQueue":[{"who":"","action":"","unlessInterruptedBy":""}]
  },
  "continuityFirewall": {
    "establishedFacts":[],"antiRetconAnchors":[],"pendingConsequences":[],
    "offscreenState":[],
    "bannedNext":[{"text":"","persistent":false}],
    "impossibleNext":[],
    "risks":[{
      "severity":"medium","issue":"","evidence":"","recommendation":""
    }]
  },
  "tools": {
    "actionResolver": {
      "userAction":"","worldResponse":"","risk":"","blockers":[]
    },
    "dialogueState": {
      "openThread":"","socialMask":"","levers":[],"taboos":[]
    },
    "directorStyle": {
      "primary":"","mask":"","push":"","voiceCues":[]
    },
    "closenessState": {
      "emotional":"","physical":"","consentSignals":[],"boundaries":[]
    },
    "imagePrompt": {
      "aspect":"","shot":"","medium":"","subject":"","positive":"",
      "negative":"","full":"","hint":""
    }
  },
  "auditLog": [{
    "system":"compiler","marker":"","result":"","repaired":false,"notes":""
  }]
}

For disabled optional modules: meters=[], scene=null, worldState=null, the
corresponding tools member=null, and auditLog=[]. Empty optional arrays inside an
enabled object are valid. Do not emit example rows when there is no evidence.`;
function buildStateCompilerPrompt(enabledModules, customModules) {
  const enabled = MODULE_CATALOG.filter((module) => enabledModules.includes(module.key)).map((module) => `- ${module.key}: ${module.description}`).join("\n");
  const enabledCustom = (customModules || []).filter((m) => m.enabled).map((m) => `- customModuleData[moduleId=${m.id}] (${m.label}): ${m.compilerInstruction} (maxItems: ${m.maxItems || 6})`).join("\n");
  const trackingText = enabled + (enabledCustom ? "\n\nEnabled custom tracking modules:\n" + enabledCustom : "");
  let customContract = "";
  let customShape = "";
  if (customModules && customModules.some((m) => m.enabled)) {
    customContract = `
- customModuleData: Array of compiled custom modules. For each enabled custom module, append an entry with the exact moduleId, label, a turn summary, and an array of items (up to its maxItems limit) containing title, text, importance (low/medium/high/critical), and optional color.`;
    customShape = `,
  "customModuleData": [
    {
      "moduleId": "custom_module_id",
      "label": "Custom Module Label",
      "summary": "Turn summary",
      "items": [
        {
          "title": "Item title",
          "text": "Item text description",
          "importance": "medium",
          "color": "#ff0000"
        }
      ]
    }
  ]`;
  }
  const coreContractWithCustom = CORE_CONTRACT + customContract;
  const closingBraceIdx = STATE_SHAPE_GUIDE.lastIndexOf("}");
  const shapeGuideWithCustom = STATE_SHAPE_GUIDE.substring(0, closingBraceIdx) + customShape + "\n}";
  return `You are LoomOS, a strict story-state compiler.

Analyze only the supplied identity, previous state seed, and transcript.
Do not continue the story. Do not roleplay. Do not address the user.
Return exactly one JSON object with no Markdown fences or commentary.

Enabled tracking modules:
${trackingText}

${coreContractWithCustom}

${shapeGuideWithCustom}

Rules:
- Ground every claim in the transcript or previous seed.
- The previous seed is continuity context, never proof that the target swipe already has state.
- Compare the seed with the newest transcript evidence and produce real delta fields.
- Carry stable facts forward unless the transcript explicitly changes them.
- Never invent changes to location, identity, clothing, injuries, ownership, relationships, or offscreen state.
- Use empty arrays and compact empty strings when evidence is absent.
- Respect all array limits. Keep prose compact and operational.
- Precompute pct, label/band, color, and trend fields wherever the contract asks for them.
- Meters diagnose current state only. They never command escalation.
- bannedNext entries are { "text": string, "persistent": boolean }; default persistent to false.
- Keep character tracking non-explicit. When age is unspecified, treat characters as adults and never output minors.
- Do not reveal hidden chain-of-thought. Secrets are reader-visible dramatic state only.
- activeModules must contain only enabled module keys.
- Use numeric ranges exactly as named: percentages 0-100, threat/observer pressure 0-10, urgency 0-5, conflict severity 1-3.
`;
}
var STATE_REPAIR_PROMPT = `Repair a malformed LoomOS State V2 compiler result.
Return exactly one corrected JSON object and no Markdown or explanation.
Keep only supported fields, satisfy all required core objects, preserve grounded
facts, obey array limits, and use null or empty arrays for disabled modules.
Do not add new story events or unsupported facts.`;

// src/backend/compiler.ts
function extractJsonObject(raw) {
  const withoutFence = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");
  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error("Compiler output did not contain a JSON object.");
  }
  return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
}
function validationError(raw) {
  try {
    const parsed = extractJsonObject(raw);
    const result = LoomOSCompiledStateSchema.safeParse(parsed);
    if (result.success) return "Unknown validation failure.";
    return result.error.issues.slice(0, 16).map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`).join("\n");
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
function parseCompilerOutput(raw, request, repaired) {
  const compiled = LoomOSCompiledStateSchema.parse(extractJsonObject(raw));
  return LoomOSStateSchema.parse({
    ...compiled,
    activeModules: request.enabledModules,
    schemaVersion: 2,
    identity: request.identity,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    source: {
      messageCount: request.messageCount,
      repaired,
      seedIdentity: request.seedState?.identity ?? null,
      connectionId: request.connectionId
    }
  });
}
function compilerUserMessage(request) {
  return [
    "TARGET IDENTITY:",
    JSON.stringify(request.identity),
    "",
    "PREVIOUS STATE SEED (compiler context only; may be null):",
    request.seedText || "null",
    "",
    "RECENT TRANSCRIPT:",
    request.transcript
  ].join("\n");
}
async function compileStateWithRepair(request) {
  request.onPhase?.("building_prompt", 1, "Building the enabled-module compiler prompt.");
  const firstMessages = [
    { role: "system", content: buildStateCompilerPrompt(request.enabledModules, request.customModules) },
    { role: "user", content: compilerUserMessage(request) }
  ];
  request.onPhase?.("requesting", 1, "Requesting structured state from the selected connection.");
  const firstRaw = await request.generate(firstMessages, request.signal, 1);
  request.onPhase?.("validating", 1, "Validating State V2 output.");
  try {
    return {
      ok: true,
      state: parseCompilerOutput(firstRaw, request, false),
      repaired: false
    };
  } catch {
    request.onPhase?.("repairing", 2, "Output was invalid; running the single repair pass.");
    const repairMessages = [
      {
        role: "system",
        content: `${STATE_REPAIR_PROMPT}

${buildStateCompilerPrompt(request.enabledModules, request.customModules)}`
      },
      {
        role: "user",
        content: [
          "Enabled modules:",
          request.enabledModules.join(", "),
          "",
          "Validation failures:",
          validationError(firstRaw),
          "",
          "Malformed output:",
          firstRaw.slice(0, 36e3)
        ].join("\n")
      }
    ];
    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    request.onPhase?.("validating", 2, "Validating repaired State V2 output.");
    try {
      return {
        ok: true,
        state: parseCompilerOutput(repairedRaw, request, true),
        repaired: true
      };
    } catch {
      return {
        ok: false,
        state: request.existingState,
        error: [
          "Compiler output remained invalid after one repair attempt.",
          validationError(repairedRaw)
        ].join(" ")
      };
    }
  }
}

// src/backend/generation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function normalizeGenerationText(result) {
  if (typeof result === "string" && result.trim()) return result;
  if (!isRecord(result)) {
    throw new Error("Lumiverse generation returned an unsupported response.");
  }
  for (const key of ["content", "text", "output", "response"]) {
    const value = result[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  const message = result.message;
  if (typeof message === "string" && message.trim()) return message;
  if (isRecord(message) && typeof message.content === "string" && message.content.trim()) {
    return message.content;
  }
  throw new Error("Lumiverse generation completed without textual content.");
}
async function runQuietGeneration(spindle2, request) {
  const controller = new AbortController();
  let timedOut = false;
  const onAbort = () => controller.abort();
  request.parentSignal.addEventListener("abort", onAbort, { once: true });
  if (request.parentSignal.aborted) controller.abort();
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, request.timeoutMs);
  try {
    const result = await spindle2.generate.quiet({
      type: "quiet",
      messages: request.messages,
      connection_id: request.connectionId || void 0,
      reasoning: { source: "off" },
      userId: request.userId,
      signal: controller.signal
    });
    return normalizeGenerationText(result);
  } catch (error) {
    if (timedOut) {
      const duration = request.timeoutMs >= 1e3 ? `${Math.round(request.timeoutMs / 1e3)} seconds` : `${request.timeoutMs} ms`;
      throw new Error(`Generation timed out after ${duration}.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    request.parentSignal.removeEventListener("abort", onAbort);
  }
}

// src/shared/compact.ts
function clean(value, max = 260) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function xmlEscape(value, max = 260) {
  return clean(value, max).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
async function buildCompactInjection(state, settings, countTokens) {
  const open = "<loomos_state>";
  const close = "</loomos_state>";
  const enabled = (key) => settings.moduleSettings[key].track && settings.moduleSettings[key].inject && state.activeModules.includes(key);
  const fragments = [];
  if (enabled("deltas")) {
    fragments.push(`delta: ${xmlEscape(state.delta.headline)}`);
    fragments.push(...state.delta.changes.slice(0, 4).map(
      (change) => `change.${change.module}.${change.importance}: ${xmlEscape(change.text)}`
    ));
  }
  if (enabled("sceneKernel")) {
    fragments.push(
      `scene: ${xmlEscape(state.kernel.scene)}; location=${xmlEscape(state.kernel.location)}; time=${xmlEscape(state.kernel.timeframe)}`,
      `focus: ${xmlEscape(state.kernel.currentFocus || state.kernel.objective)}`
    );
  }
  if (enabled("continuity")) {
    fragments.push(...state.continuityFirewall.antiRetconAnchors.slice(0, 6).map(
      (item) => `anchor: ${xmlEscape(item)}`
    ));
    fragments.push(...state.continuityFirewall.pendingConsequences.slice(0, 5).map(
      (item) => `pending: ${xmlEscape(item)}`
    ));
  }
  if (enabled("actionResolver") && state.tools.actionResolver) {
    const resolver = state.tools.actionResolver;
    fragments.push(
      `action: ${xmlEscape(resolver.userAction)}; response=${xmlEscape(resolver.worldResponse)}; risk=${xmlEscape(resolver.risk)}`
    );
  }
  if (enabled("castCore")) {
    fragments.push(...state.castMatrix.filter((member) => member.kind === "pov" || member.kind === "main" || member.spotlight.value >= 45).slice(0, 6).map(
      (member) => `cast.${xmlEscape(member.name, 80)}: ${xmlEscape(member.status)}; intent=${xmlEscape(member.intent)}; goal=${xmlEscape(member.goals[0] ?? "")}`
    ));
  }
  if (enabled("worldSpace") && state.scene) {
    fragments.push(
      `access: ${state.scene.access.exit}; sight=${xmlEscape(state.scene.access.lineOfSight)}; noise=${xmlEscape(state.scene.access.noiseMask)}`,
      ...state.scene.spatial.slice(0, 4).map((item) => `space: ${xmlEscape(item)}`)
    );
  }
  if (enabled("inventory")) {
    fragments.push(...state.castMatrix.flatMap(
      (member) => member.pockets.filter((item) => item.known).slice(0, 3).map(
        (item) => `item.${xmlEscape(member.name, 60)}: ${xmlEscape(item.name)} x${item.qty}; ${xmlEscape(item.condition)}`
      )
    ).slice(0, 8));
  }
  if (enabled("storyThreads")) {
    fragments.push(...state.storyState.threadLoom.filter((thread) => thread.status !== "resolved").sort((a, b) => b.urgency - a.urgency).slice(0, 6).map(
      (thread) => `thread.${xmlEscape(thread.title, 100)}: ${thread.status}/${thread.urgency}; ${xmlEscape(thread.nextPressure)}`
    ));
    fragments.push(...state.storyState.stakes.slice(0, 3).map(
      (stake) => `stakes.${xmlEscape(stake.who, 80)}: win=${xmlEscape(stake.win)}; lose=${xmlEscape(stake.lose)}`
    ));
  }
  if (enabled("continuity")) {
    fragments.push(...state.continuityFirewall.risks.filter((risk) => risk.severity === "high" || risk.severity === "critical").slice(0, 4).map((risk) => `risk.${risk.severity}: ${xmlEscape(risk.issue)}`));
  }
  const enabledCustomMods = settings.customModules || [];
  for (const cm of enabledCustomMods) {
    if (cm.enabled && cm.inject) {
      const compiled = state.customModuleData?.find((m) => m.moduleId === cm.id);
      if (compiled && compiled.items.length > 0) {
        fragments.push(
          `cmod.${xmlEscape(cm.label, 80)}: ${xmlEscape(compiled.summary)}`,
          ...compiled.items.slice(0, 3).map(
            (it) => `item.${xmlEscape(cm.label, 60)}: ${xmlEscape(it.title)} - ${xmlEscape(it.text)}`
          )
        );
      }
    }
  }
  const selected = [];
  for (const fragment of fragments.filter((item) => !item.endsWith(": "))) {
    const candidate = `${open}
${[...selected, fragment].join("\n")}
${close}`;
    if (await countTokens(candidate) <= settings.injectionTokenBudget) {
      selected.push(fragment);
    }
  }
  if (selected.length === 0) {
    return `${open}
scene: ${xmlEscape(state.kernel.scene, Math.max(24, settings.injectionTokenBudget * 2))}
${close}`;
  }
  return `${open}
${selected.join("\n")}
${close}`;
}

// src/shared/migrations.ts
function migrateLegacyState(state) {
  return LoomOSStateSchema.parse({
    schemaVersion: 2,
    identity: state.identity,
    generatedAt: state.generatedAt,
    source: {
      messageCount: state.source.messageCount,
      repaired: state.source.repaired,
      seedIdentity: null,
      connectionId: ""
    },
    activeModules: [
      "sceneKernel",
      "deltas",
      "castCore",
      "relationships",
      "storyThreads",
      "continuity"
    ],
    kernel: {
      ...state.kernel,
      date: "",
      time: "",
      elapsed: "",
      weather: "",
      pov: "",
      topic: "",
      theme: "",
      currentFocus: state.kernel.objective,
      nextFocus: "",
      currentRisk: state.continuityFirewall.risks[0]?.issue ?? "",
      stopMode: "",
      stopWhy: ""
    },
    delta: {
      headline: "Migrated from LoomOS State V1.",
      changedModules: [],
      changes: [],
      carriedForward: state.continuityFirewall.establishedFacts.slice(0, 6),
      newlyEstablished: []
    },
    meters: [],
    scene: null,
    castMatrix: state.castMatrix.map((member, index) => ({
      id: `${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cast"}-${index + 1}`,
      name: member.name,
      kind: "npc",
      qty: 1,
      role: member.role,
      location: member.location,
      status: member.status,
      emotionalState: member.emotionalState,
      intent: member.goals[0] ?? "",
      pose: "",
      proximity: "",
      hands: "",
      awareness: "ambient",
      threat: {
        value: 0,
        pct: "0%",
        band: "none",
        color: "muted",
        note: ""
      },
      spotlight: {
        value: 50,
        pct: "50%",
        band: "present",
        color: "accent",
        trend: "unknown",
        note: ""
      },
      visualAnchor: "",
      identitySummary: `${member.role}; ${member.status}`,
      clothingSummary: "",
      goals: member.goals.slice(0, 6),
      relationships: member.relationships.slice(0, 8),
      leverage: member.leverage.slice(0, 6),
      pockets: [],
      stableFacts: []
    })),
    worldState: {
      recentEnvironmentalChanges: [],
      activeHazards: [],
      rumors: [],
      secrets: state.continuityFirewall.secrets.slice(0, 8).map((secret) => ({
        secret,
        visibleHint: "",
        knownBy: []
      })),
      loadedSigns: []
    },
    storyState: {
      goals: [],
      conflicts: [],
      threadLoom: state.threadLoom.map((thread) => ({
        ...thread,
        priority: thread.urgency >= 5 ? "critical" : thread.urgency >= 3 ? "high" : "medium",
        progress: thread.status === "resolved" ? 10 : 0,
        pct: thread.status === "resolved" ? "100%" : "0%",
        color: thread.status === "resolved" ? "success" : "accent",
        label: thread.status
      })),
      stakes: [],
      countdowns: [],
      autonomyQueue: []
    },
    continuityFirewall: {
      establishedFacts: state.continuityFirewall.establishedFacts,
      antiRetconAnchors: state.kernel.constraints,
      pendingConsequences: state.continuityFirewall.pendingConsequences,
      offscreenState: [],
      bannedNext: [],
      impossibleNext: [],
      risks: state.continuityFirewall.risks
    },
    tools: {
      actionResolver: null,
      dialogueState: null,
      directorStyle: null,
      closenessState: null,
      imagePrompt: null
    },
    auditLog: [{
      system: "migration",
      marker: "schemaVersion 1",
      result: "Converted to schemaVersion 2",
      repaired: false,
      notes: "Original V1 fields were preserved in their closest V2 modules."
    }]
  });
}
function migrateStateToCurrent(value) {
  const current = LoomOSStateSchema.safeParse(value);
  if (current.success) return current.data;
  const legacy = LegacyLoomOSStateSchema.safeParse(value);
  if (legacy.success) return migrateLegacyState(legacy.data);
  return null;
}

// src/shared/seed.ts
function compactText(value, max = 240) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function trimJsonToBudget(value, tokenBudget) {
  const serialized = JSON.stringify(value);
  const maxChars = Math.max(800, tokenBudget * 4);
  if (serialized.length <= maxChars) return serialized;
  return JSON.stringify({
    snapshotExcerpt: serialized.slice(0, maxChars - 120),
    truncated: true
  });
}
function buildStateSeedForCompiler(state, settings) {
  const modules = settings.moduleSettings;
  const seed = {
    identity: state.identity,
    generatedAt: state.generatedAt,
    kernel: {
      scene: compactText(state.kernel.scene),
      location: compactText(state.kernel.location),
      timeframe: compactText(state.kernel.timeframe),
      date: compactText(state.kernel.date),
      time: compactText(state.kernel.time),
      elapsed: compactText(state.kernel.elapsed),
      pov: compactText(state.kernel.pov),
      tone: compactText(state.kernel.tone),
      objective: compactText(state.kernel.objective),
      currentFocus: compactText(state.kernel.currentFocus),
      currentRisk: compactText(state.kernel.currentRisk),
      constraints: state.kernel.constraints.slice(0, 8).map(compactText)
    },
    cast: state.castMatrix.slice(0, 10).map((member) => ({
      id: member.id,
      name: member.name,
      kind: member.kind,
      location: compactText(member.location),
      status: compactText(member.status),
      intent: compactText(member.intent),
      clothing: modules.clothing.track ? compactText(member.clothingSummary) : void 0,
      goals: member.goals.slice(0, 4).map(compactText),
      relationships: modules.relationships.track ? member.relationships.slice(0, 4).map(compactText) : void 0,
      pockets: modules.inventory.track ? member.pockets.slice(0, 4).map((item) => ({
        name: item.name,
        qty: item.qty,
        condition: compactText(item.condition),
        known: item.known
      })) : void 0,
      stableFacts: member.stableFacts.slice(0, 4).map(compactText)
    })),
    story: {
      threads: state.storyState.threadLoom.filter((thread) => thread.status !== "resolved").slice(0, 8).map((thread) => ({
        title: thread.title,
        status: thread.status,
        urgency: thread.urgency,
        progress: thread.progress,
        nextPressure: compactText(thread.nextPressure)
      })),
      countdowns: state.storyState.countdowns.slice(0, 4),
      stakes: state.storyState.stakes.slice(0, 4)
    },
    continuity: {
      facts: state.continuityFirewall.establishedFacts.slice(0, 12).map(compactText),
      anchors: state.continuityFirewall.antiRetconAnchors.slice(0, 10).map(compactText),
      pending: state.continuityFirewall.pendingConsequences.slice(0, 10).map(compactText),
      offscreen: state.continuityFirewall.offscreenState.slice(0, 8).map(compactText),
      persistentBans: state.continuityFirewall.bannedNext.filter((item) => item.persistent).slice(0, 6).map((item) => compactText(item.text))
    },
    world: modules.worldSpace.track && state.scene ? {
      privacy: state.scene.privacy,
      access: state.scene.access,
      spatial: state.scene.spatial.slice(0, 6).map(compactText),
      items: modules.inventory.track ? state.scene.items.slice(0, 6) : void 0
    } : void 0,
    custom: (state.customModuleData || []).filter((m) => settings.customModules?.find((cm) => cm.id === m.moduleId && cm.enabled)).map((m) => ({
      id: m.moduleId,
      summary: compactText(m.summary),
      items: m.items.slice(0, 4).map((it) => ({
        title: it.title,
        text: compactText(it.text),
        importance: it.importance
      }))
    }))
  };
  return trimJsonToBudget(seed, settings.compilerSeedTokenBudget);
}

// src/shared/storage.ts
var SETTINGS_PATH = "settings.json";
function encodeStorageSegment(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
}
function messageStatePrefix(chatId, messageId) {
  return [
    "chats",
    encodeStorageSegment(chatId),
    "messages",
    encodeStorageSegment(messageId),
    "swipes"
  ].join("/");
}
function stateStoragePath(identity) {
  const parsed = StateIdentitySchema.parse(identity);
  return `${messageStatePrefix(parsed.chatId, parsed.messageId)}/${parsed.swipeId}.json`;
}

// src/backend.ts
var EXTENSION_ID = "loomos_command_deck";
var disposers = [];
var activeChatByUser = /* @__PURE__ */ new Map();
var usersByChat = /* @__PURE__ */ new Map();
var jobs = /* @__PURE__ */ new Map();
var jobByIdentity = /* @__PURE__ */ new Map();
var interceptorRegistered = false;
var interceptorEnabled = spindle.permissions.has("interceptor");
var disposed = false;
function isRecord2(value) {
  return typeof value === "object" && value !== null;
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function permissionSnapshot() {
  return {
    generation: spindle.permissions.has("generation"),
    interceptor: spindle.permissions.has("interceptor"),
    chatMutation: spindle.permissions.has("chat_mutation")
  };
}
function send(payload, userId) {
  if (!disposed) spindle.sendToFrontend(payload, userId);
}
function rememberUserChat(userId, chatId) {
  const previous = activeChatByUser.get(userId);
  if (previous && previous !== chatId) {
    const previousUsers = usersByChat.get(previous);
    previousUsers?.delete(userId);
    if (previousUsers?.size === 0) usersByChat.delete(previous);
  }
  if (!chatId) {
    activeChatByUser.delete(userId);
    return;
  }
  activeChatByUser.set(userId, chatId);
  const users = usersByChat.get(chatId) ?? /* @__PURE__ */ new Set();
  users.add(userId);
  usersByChat.set(chatId, users);
}
function eventUsers(chatId, eventUserId) {
  if (eventUserId) {
    rememberUserChat(eventUserId, chatId);
    return [eventUserId];
  }
  return [...usersByChat.get(chatId) ?? []];
}
async function getSettings(userId) {
  const raw = await spindle.userStorage.getJson(SETTINGS_PATH, {
    fallback: DEFAULT_SETTINGS,
    userId
  });
  const parsed = LoomOSSettingsSchema.safeParse(raw);
  if (parsed.success) {
    if (!isRecord2(raw) || raw.schemaVersion !== 2) {
      await spindle.userStorage.setJson(SETTINGS_PATH, parsed.data, {
        indent: 2,
        userId
      });
    }
    return parsed.data;
  }
  spindle.log.warn("Invalid LoomOS settings found; defaults will be used.");
  return DEFAULT_SETTINGS;
}
async function saveSettings(settings, userId) {
  const parsed = LoomOSSettingsSchema.parse(settings);
  await spindle.userStorage.setJson(SETTINGS_PATH, parsed, { indent: 2, userId });
  return parsed;
}
async function getMessages(chatId) {
  if (!spindle.permissions.has("chat_mutation")) {
    throw new Error("PERMISSION_DENIED: chat_mutation is required to read chat history.");
  }
  return spindle.chat.getMessages(chatId);
}
async function resolveIdentity(requested) {
  const messages = await getMessages(requested.chatId);
  const messageId = requested.messageId ?? messages.at(-1)?.id;
  if (!messageId) throw new Error("This chat has no message to attach LoomOS state to.");
  const message = messages.find((candidate) => candidate.id === messageId);
  if (!message) throw new Error("The requested message no longer exists in this chat.");
  const swipeId = requested.swipeId ?? message.swipe_id;
  if (!Number.isInteger(swipeId) || swipeId < 0 || swipeId >= message.swipes.length) {
    throw new Error("The requested swipe no longer exists for this message.");
  }
  return StateIdentitySchema.parse({
    chatId: requested.chatId,
    messageId,
    swipeId
  });
}
async function loadState(identity, userId) {
  const path = stateStoragePath(identity);
  const raw = await spindle.userStorage.getJson(path, {
    fallback: null,
    userId
  });
  const state = migrateStateToCurrent(raw);
  if (!state) return null;
  if (state.identity.chatId !== identity.chatId || state.identity.messageId !== identity.messageId || state.identity.swipeId !== identity.swipeId) {
    spindle.log.warn("Ignored a LoomOS state file with mismatched identity.");
    return null;
  }
  if (isRecord2(raw) && raw.schemaVersion === 1) {
    await spindle.userStorage.setJson(path, state, { indent: 2, userId });
  }
  return state;
}
async function persistState(state, userId) {
  const parsed = LoomOSStateSchema.parse(state);
  await spindle.userStorage.setJson(stateStoragePath(parsed.identity), parsed, {
    indent: 2,
    userId
  });
  return parsed;
}
async function deleteState(identity, userId) {
  const path = stateStoragePath(identity);
  if (await spindle.userStorage.exists(path, userId)) {
    await spindle.userStorage.delete(path, userId);
  }
}
async function invalidateMessageStates(chatId, messageId, userId) {
  const paths = await spindle.userStorage.list(messageStatePrefix(chatId, messageId), userId);
  await Promise.all(paths.map((path) => spindle.userStorage.delete(path, userId)));
}
async function listChatStates(chatId, userId) {
  const prefix = `chats/${encodeStorageSegment(chatId)}/messages`;
  try {
    const files = await spindle.userStorage.list(prefix, userId);
    const results = [];
    for (const file of files) {
      const parts = file.split("/");
      if (parts.length >= 6 && parts[4] === "swipes" && parts[5]?.endsWith(".json")) {
        const messageId = decodeURIComponent(parts[3]);
        const swipeIdStr = parts[5].replace(".json", "");
        const swipeId = parseInt(swipeIdStr, 10);
        if (messageId && !isNaN(swipeId)) {
          results.push({ messageId, swipeId });
        }
      }
    }
    return results;
  } catch (error) {
    spindle.log.warn(`LoomOS could not list chat states: ${errorMessage(error)}`);
    return [];
  }
}
async function buildStateHistory(chatId, userId) {
  const items = [];
  try {
    const states = await listChatStates(chatId, userId);
    for (const entry of states) {
      const identity = {
        chatId,
        messageId: entry.messageId,
        swipeId: entry.swipeId
      };
      const fullState = await loadState(identity, userId);
      if (!fullState) continue;
      const raw = {
        identity,
        generatedAt: fullState.generatedAt,
        schemaVersion: fullState.schemaVersion,
        kernelScene: fullState.kernel.scene,
        kernelFocus: fullState.kernel.currentFocus || fullState.kernel.objective,
        kernelLocation: fullState.kernel.location,
        kernelTime: fullState.kernel.timeframe || `${fullState.kernel.date} ${fullState.kernel.time}`,
        deltaHeadline: fullState.delta.headline,
        castCount: fullState.castMatrix.length,
        threadCount: fullState.storyState.threadLoom.filter((t) => t.status !== "resolved").length,
        riskCount: fullState.continuityFirewall.risks.length,
        repaired: fullState.source.repaired,
        seedIdentity: fullState.source.seedIdentity,
        activeModuleCount: fullState.activeModules.length
      };
      items.push(StateHistoryItemSchema.parse(raw));
    }
    items.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  } catch (error) {
    spindle.log.warn(`LoomOS could not build state history: ${errorMessage(error)}`);
  }
  return items;
}
async function buildInjectionPreview(chatId, userId) {
  try {
    const settings = await getSettings(userId);
    const messages = await getMessages(chatId);
    const latest = messages.at(-1);
    if (!latest) return null;
    const identity = StateIdentitySchema.parse({
      chatId,
      messageId: latest.id,
      swipeId: latest.swipe_id
    });
    const state = await loadState(identity, userId);
    if (!state) return null;
    const budget = settings.injectionTokenBudget;
    const allFragments = [];
    const includedNames = [];
    const omittedNames = [];
    const enabled = (key) => settings.moduleSettings[key].track && settings.moduleSettings[key].inject && state.activeModules.includes(key);
    for (const modKey of MODULE_KEYS) {
      if (!settings.moduleSettings[modKey].track) continue;
      if (settings.moduleSettings[modKey].inject && state.activeModules.includes(modKey)) {
        includedNames.push(modKey);
      } else {
        omittedNames.push(modKey);
      }
    }
    const enabledCustomMods = settings.customModules || [];
    for (const cm of enabledCustomMods) {
      if (cm.enabled && cm.inject) {
        includedNames.push("cmod:" + cm.label);
      } else if (cm.enabled) {
        omittedNames.push("cmod:" + cm.label);
      }
    }
    const compact = await buildCompactInjection(state, settings, async (text) => {
      try {
        return (await spindle.tokens.countText(text, { userId })).total_tokens;
      } catch {
        return Math.ceil(text.length / 4);
      }
    });
    const tokenResult = await (async () => {
      try {
        return (await spindle.tokens.countText(compact, { userId })).total_tokens;
      } catch {
        return Math.ceil(compact.length / 4);
      }
    })();
    const withinBudget = tokenResult <= budget;
    let warning = null;
    if (!withinBudget) {
      warning = `Injection is ${tokenResult - budget} tokens over the configured budget of ${budget}. Some data was dropped.`;
    } else if (tokenResult > budget * 0.8) {
      warning = `Injection is near the budget limit (${tokenResult}/${budget} tokens).`;
    }
    return {
      text: compact,
      estimatedTokens: tokenResult,
      budget,
      withinBudget,
      includedModules: includedNames,
      omittedModules: omittedNames,
      warning
    };
  } catch (error) {
    spindle.log.warn(`LoomOS injection preview failed: ${errorMessage(error)}`);
    return null;
  }
}
async function sendExactState(userId, identity, requestId) {
  send({
    type: "state",
    requestId,
    identity,
    state: await loadState(identity, userId)
  }, userId);
}
function transcriptContent(message, identity) {
  if (message.id !== identity.messageId) return message.content;
  return message.swipes[identity.swipeId] ?? message.content;
}
async function buildTranscript(identity, settings, messages) {
  const allMessages = messages ?? await getMessages(identity.chatId);
  const targetIndex = allMessages.findIndex((message) => message.id === identity.messageId);
  if (targetIndex < 0) throw new Error("The target message disappeared before compilation.");
  const start = Math.max(0, targetIndex + 1 - settings.recentMessageLimit);
  const selected = allMessages.slice(start, targetIndex + 1);
  const transcript = selected.map((message) => {
    const role = message.is_user ? "USER" : "ASSISTANT";
    const name = message.name ? ` ${message.name}` : "";
    const content = transcriptContent(message, identity).slice(0, 12e3);
    return `[${message.index_in_chat} ${role}${name}]
${content}`;
  }).join("\n\n");
  return { transcript, messageCount: selected.length, messages: allMessages };
}
async function loadCompilationSeed(identity, userId, settings, messages, exactState) {
  if (exactState) {
    return {
      state: exactState,
      text: buildStateSeedForCompiler(exactState, settings)
    };
  }
  const targetIndex = messages.findIndex((message) => message.id === identity.messageId);
  for (let index = targetIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) continue;
    const previousIdentity = StateIdentitySchema.parse({
      chatId: identity.chatId,
      messageId: message.id,
      swipeId: message.swipe_id
    });
    const previous = await loadState(previousIdentity, userId);
    if (previous) {
      return {
        state: previous,
        text: buildStateSeedForCompiler(previous, settings)
      };
    }
  }
  return { state: null, text: "null" };
}
function connectionSummary(connection) {
  return {
    id: connection.id,
    name: connection.name,
    provider: connection.provider,
    model: connection.model,
    isDefault: connection.is_default,
    ready: connection.has_api_key
  };
}
async function listConnections(userId) {
  if (!spindle.permissions.has("generation")) return [];
  try {
    return (await spindle.connections.list(userId)).map(connectionSummary);
  } catch (error) {
    spindle.log.warn(`LoomOS could not list connections: ${errorMessage(error)}`);
    return [];
  }
}
function chooseConnection(connections, requestedId) {
  if (requestedId) {
    const selected = connections.find((connection) => connection.id === requestedId);
    if (!selected) throw new Error("The selected LoomOS connection no longer exists.");
    if (!selected.ready) throw new Error(`Connection "${selected.name}" has no API key configured.`);
    return selected;
  }
  return connections.find((connection) => connection.isDefault && connection.ready) ?? connections.find((connection) => connection.ready) ?? null;
}
function requestJobKey(userId, requestId) {
  return `${userId}:${requestId}`;
}
function identityJobKey(userId, identity) {
  return `${userId}:${stateStoragePath(identity)}`;
}
function abortJob(jobKey) {
  jobs.get(jobKey)?.controller.abort();
}
async function generateState(requestId, requested, userId) {
  if (!spindle.permissions.has("generation")) {
    throw new Error("PERMISSION_DENIED: generation is required to compile LoomOS state.");
  }
  const startedAt = Date.now();
  const identity = await resolveIdentity(requested);
  const settings = await getSettings(userId);
  const existingState = await loadState(identity, userId);
  const transcriptResult = await buildTranscript(identity, settings);
  const connections = await listConnections(userId);
  const connection = chooseConnection(connections, settings.connectionId);
  if (!connection) {
    throw new Error("No ready Lumiverse LLM connection is available. Configure a connection, then retry.");
  }
  const controller = new AbortController();
  const jobKey = requestJobKey(userId, requestId);
  const identityKey = identityJobKey(userId, identity);
  const previousJob = jobByIdentity.get(identityKey);
  if (previousJob) abortJob(previousJob);
  jobs.set(jobKey, { controller, identityKey });
  jobByIdentity.set(identityKey, jobKey);
  const progress = (phase, attempt, message) => {
    send({
      type: "generation_status",
      requestId,
      status: "progress",
      identity,
      message,
      report: {
        phase,
        attempt,
        elapsedMs: Date.now() - startedAt,
        connectionId: connection.id,
        message
      }
    }, userId);
  };
  send({
    type: "generation_status",
    requestId,
    status: "started",
    identity,
    message: `Preparing ${connection.name} (${connection.model || connection.provider}).`,
    report: {
      phase: "resolving",
      attempt: 1,
      elapsedMs: 0,
      connectionId: connection.id,
      message: "Resolved exact message and swipe."
    }
  }, userId);
  try {
    progress("loading_seed", 1, "Loading continuity seed from this or the nearest prior message.");
    const seed = await loadCompilationSeed(
      identity,
      userId,
      settings,
      transcriptResult.messages,
      existingState
    );
    const enabledModules = trackedModuleKeys(settings);
    const compiled = await compileStateWithRepair({
      identity,
      transcript: transcriptResult.transcript,
      messageCount: transcriptResult.messageCount,
      existingState,
      seedState: seed.state,
      seedText: seed.text,
      enabledModules,
      customModules: settings.customModules,
      connectionId: connection.id,
      signal: controller.signal,
      onPhase: progress,
      generate: async (messages, signal) => runQuietGeneration(spindle, {
        messages,
        connectionId: connection.id,
        userId,
        timeoutMs: settings.generationTimeoutSeconds * 1e3,
        parentSignal: signal
      })
    });
    if (controller.signal.aborted) throw new DOMException("Generation cancelled.", "AbortError");
    if (!compiled.ok) {
      send({ type: "state", requestId, identity, state: compiled.state }, userId);
      send({
        type: "generation_status",
        requestId,
        status: "failed",
        identity,
        message: compiled.error
      }, userId);
      return;
    }
    progress("saving", compiled.repaired ? 2 : 1, "Saving validated exact-swipe state.");
    const state = await persistState(compiled.state, userId);
    send({ type: "state", requestId, identity, state }, userId);
    send({
      type: "generation_status",
      requestId,
      status: "completed",
      identity,
      message: compiled.repaired ? "State compiled after one repair pass." : "State compiled and saved.",
      report: {
        phase: "saving",
        attempt: compiled.repaired ? 2 : 1,
        elapsedMs: Date.now() - startedAt,
        connectionId: connection.id,
        message: "Validated state saved."
      }
    }, userId);
  } catch (error) {
    if (controller.signal.aborted || error instanceof Error && error.name === "AbortError") {
      send({
        type: "generation_status",
        requestId,
        status: "cancelled",
        identity,
        message: "Generation cancelled."
      }, userId);
      return;
    }
    const message = errorMessage(error);
    spindle.log.error(`LoomOS generation failed (${connection.id}): ${message}`);
    send({
      type: "generation_status",
      requestId,
      status: "failed",
      identity,
      message
    }, userId);
  } finally {
    if (jobs.get(jobKey)?.controller === controller) jobs.delete(jobKey);
    if (jobByIdentity.get(identityKey) === jobKey) jobByIdentity.delete(identityKey);
  }
}
function parseFrontendRequest(payload) {
  if (!isRecord2(payload) || typeof payload.type !== "string") {
    throw new Error("Invalid LoomOS frontend request.");
  }
  return payload;
}
async function handleFrontendRequest(payload, userId) {
  let requestId;
  try {
    const request = parseFrontendRequest(payload);
    requestId = "requestId" in request ? request.requestId : void 0;
    switch (request.type) {
      case "ready": {
        rememberUserChat(userId, request.active?.chatId ?? null);
        const settings = await getSettings(userId);
        const identity = request.active ? await resolveIdentity(request.active).catch(() => null) : null;
        send({
          type: "bootstrap",
          settings,
          permissions: permissionSnapshot(),
          connections: await listConnections(userId),
          identity,
          state: identity ? await loadState(identity, userId) : null
        }, userId);
        return;
      }
      case "frontend_disposed":
        rememberUserChat(userId, null);
        return;
      case "get_settings":
        send({ type: "settings", requestId, settings: await getSettings(userId) }, userId);
        return;
      case "save_settings":
        send({
          type: "settings",
          requestId,
          settings: await saveSettings(request.settings, userId)
        }, userId);
        return;
      case "get_connections":
        send({ type: "connections", requestId, connections: await listConnections(userId) }, userId);
        return;
      case "get_state": {
        const identity = await resolveIdentity(request.identity);
        rememberUserChat(userId, identity.chatId);
        await sendExactState(userId, identity, requestId);
        return;
      }
      case "save_state": {
        const resolvedIdentity = await resolveIdentity(request.state.identity);
        if (resolvedIdentity.chatId !== request.state.identity.chatId || resolvedIdentity.messageId !== request.state.identity.messageId || resolvedIdentity.swipeId !== request.state.identity.swipeId) {
          throw new Error("State identity does not match the live message swipe.");
        }
        const state = await persistState(request.state, userId);
        send({ type: "state", requestId, identity: state.identity, state }, userId);
        return;
      }
      case "delete_state": {
        const identity = await resolveIdentity(request.identity);
        await deleteState(identity, userId);
        send({ type: "state", requestId, identity, state: null }, userId);
        return;
      }
      case "generate_state":
        void generateState(request.requestId, request.identity, userId).catch((error) => {
          send({
            type: "generation_status",
            requestId: request.requestId,
            status: "failed",
            message: errorMessage(error)
          }, userId);
        });
        return;
      case "cancel_generation":
        abortJob(requestJobKey(userId, request.requestId));
        return;
      case "refresh_permissions":
        send({ type: "permissions", requestId, permissions: permissionSnapshot() }, userId);
        return;
      case "get_chat_states": {
        const states = await listChatStates(request.chatId, userId);
        send({ type: "chat_states", requestId, chatId: request.chatId, states }, userId);
        return;
      }
      case "list_state_history": {
        const history = await buildStateHistory(request.chatId, userId);
        send({ type: "state_history", requestId, chatId: request.chatId, items: history }, userId);
        return;
      }
      case "preview_injection": {
        const preview = await buildInjectionPreview(request.chatId, userId);
        send({ type: "injection_preview", requestId, preview }, userId);
        return;
      }
    }
  } catch (error) {
    send({ type: "error", requestId, message: errorMessage(error) }, userId);
  }
}
function eventMessage(payload) {
  if (!isRecord2(payload) || !isRecord2(payload.message)) return null;
  const message = payload.message;
  if (typeof message.id !== "string" || typeof message.chat_id !== "string" || typeof message.swipe_id !== "number" || !Array.isArray(message.swipes)) return null;
  return message;
}
async function handleMessageEdited(payload, eventUserId) {
  const message = eventMessage(payload);
  if (!message) return;
  const identity = StateIdentitySchema.parse({
    chatId: message.chat_id,
    messageId: message.id,
    swipeId: message.swipe_id
  });
  for (const userId of eventUsers(message.chat_id, eventUserId)) {
    await deleteState(identity, userId);
    await sendExactState(userId, identity);
  }
}
async function handleMessageSwiped(payload, eventUserId) {
  const activeIdentity = StateIdentitySchema.parse({
    chatId: payload.chatId,
    messageId: payload.message.id,
    swipeId: payload.message.swipe_id
  });
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    if (payload.action === "deleted") {
      await invalidateMessageStates(payload.chatId, payload.message.id, userId);
    } else if (payload.action === "updated" || payload.action === "added") {
      await deleteState(StateIdentitySchema.parse({
        chatId: payload.chatId,
        messageId: payload.message.id,
        swipeId: payload.swipeId
      }), userId);
    }
    await sendExactState(userId, activeIdentity);
  }
}
async function handleSwipeEdited(payload, eventUserId) {
  const identity = StateIdentitySchema.parse({
    chatId: payload.chatId,
    messageId: payload.message.id,
    swipeId: payload.message.swipe_id
  });
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    await invalidateMessageStates(payload.chatId, payload.message.id, userId);
    await sendExactState(userId, identity);
  }
}
async function handleMessageDeleted(payload, eventUserId) {
  if (!isRecord2(payload) || typeof payload.chatId !== "string" || typeof payload.messageId !== "string") return;
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    await invalidateMessageStates(payload.chatId, payload.messageId, userId);
  }
}
async function handleMessageSent(payload, eventUserId) {
  const message = eventMessage(payload);
  if (!message) return;
  const identity = StateIdentitySchema.parse({
    chatId: message.chat_id,
    messageId: message.id,
    swipeId: message.swipe_id
  });
  for (const userId of eventUsers(message.chat_id, eventUserId)) {
    await sendExactState(userId, identity);
    const settings = await getSettings(userId);
    const shouldGenerate = settings.autoGeneration === "every" || settings.autoGeneration === "assistant" && !message.is_user;
    if (shouldGenerate && spindle.permissions.has("generation")) {
      void generateState(
        `auto:${message.id}:${message.swipe_id}:${Date.now()}`,
        identity,
        userId
      ).catch((error) => {
        spindle.log.warn(`LoomOS automatic generation skipped: ${errorMessage(error)}`);
      });
    }
  }
}
function tryRegisterInterceptor() {
  if (interceptorRegistered || !spindle.permissions.has("interceptor")) return;
  interceptorRegistered = true;
  interceptorEnabled = true;
  spindle.registerInterceptor(async (messages, context) => {
    if (!interceptorEnabled || disposed || !isRecord2(context)) return messages;
    if (context.generationType === "quiet" || typeof context.chatId !== "string") return messages;
    if (!spindle.permissions.has("chat_mutation")) return messages;
    const chatId = context.chatId;
    const chatUsers = usersByChat.get(chatId);
    if (!chatUsers || chatUsers.size !== 1) return messages;
    const userId = [...chatUsers][0];
    try {
      const settings = await getSettings(userId);
      if (!settings.injectionEnabled) return messages;
      const storedMessages = await getMessages(chatId);
      const latest = storedMessages.at(-1);
      if (!latest) return messages;
      const identity = StateIdentitySchema.parse({
        chatId,
        messageId: latest.id,
        swipeId: latest.swipe_id
      });
      const state = await loadState(identity, userId);
      if (!state) return messages;
      const compact = await buildCompactInjection(state, settings, async (text) => {
        try {
          return (await spindle.tokens.countText(text, { userId })).total_tokens;
        } catch {
          return Math.ceil(text.length / 4);
        }
      });
      const injected = { role: "system", content: compact };
      return {
        messages: [injected, ...messages],
        breakdown: [{ messageIndex: 0, name: "LoomOS Story State" }]
      };
    } catch (error) {
      spindle.log.warn(`LoomOS injection skipped: ${errorMessage(error)}`);
      return messages;
    }
  }, 70);
}
function disposeBackend() {
  if (disposed) return;
  disposed = true;
  interceptorEnabled = false;
  for (const { controller } of jobs.values()) controller.abort();
  jobs.clear();
  jobByIdentity.clear();
  for (const dispose of disposers.splice(0).reverse()) {
    try {
      dispose();
    } catch {
    }
  }
  activeChatByUser.clear();
  usersByChat.clear();
}
disposers.push(spindle.onFrontendMessage((payload, userId) => {
  void handleFrontendRequest(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_SENT", (payload, userId) => {
  void handleMessageSent(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_EDITED", (payload, userId) => {
  void handleMessageEdited(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_DELETED", (payload, userId) => {
  void handleMessageDeleted(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_SWIPED", (payload, userId) => {
  void handleMessageSwiped(payload, userId);
}));
disposers.push(spindle.on("SWIPE_EDITED", (payload, userId) => {
  void handleSwipeEdited(payload, userId);
}));
disposers.push(spindle.permissions.onDenied(({ permission, operation }) => {
  spindle.log.warn(`LoomOS permission denied: ${permission} for ${operation}.`);
}));
disposers.push(spindle.permissions.onChanged(({ permission, granted }) => {
  if (permission === "generation" && !granted) {
    for (const { controller } of jobs.values()) controller.abort();
  }
  if (permission === "interceptor") {
    interceptorEnabled = granted;
    if (granted) tryRegisterInterceptor();
  }
  for (const userId of activeChatByUser.keys()) {
    send({ type: "permissions", permissions: permissionSnapshot() }, userId);
  }
}));
disposers.push(spindle.on("SPINDLE_EXTENSION_UNLOADED", (payload) => {
  if (isRecord2(payload) && payload.extensionId === EXTENSION_ID) disposeBackend();
}));
tryRegisterInterceptor();
spindle.log.info("LoomOS Command Deck backend loaded.");
export {
  disposeBackend
};
