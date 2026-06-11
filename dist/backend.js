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
    const arrayValue2 = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue2.push(s.value);
    }
    return { status: status.value, value: arrayValue2 };
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
  "appearance",
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
  {
    key: "sceneKernel",
    label: "Scene Context",
    group: "Core",
    core: true,
    intensity: "medium",
    description: "Scene, time, tone, focus, objective, and constraints.",
    schemaSummary: "scene, location, timeframe, date, time, elapsed, weather, pov, tone, topic, theme, objective, summary, currentFocus, nextFocus, currentRisk, stopMode, stopWhy, constraints[]",
    compilerInstruction: "Scene metadata, focus, and constraints from transcript and seed. Ground in transcript evidence; carry forward stable scene context.",
    injectionBehavior: "Injected as scene: location, time, focus line. Always included when enabled.",
    renderBehavior: "Pulse view \u2014 compact scene focus, summary, constraints, and facts."
  },
  {
    key: "deltas",
    label: "Recent Changes",
    group: "Core",
    core: true,
    intensity: "medium",
    description: "Meaningful changes from the previous compiled state.",
    schemaSummary: "headline, changedModules[], changes[{text, age, module, importance}], carriedForward[], newlyEstablished[]",
    compilerInstruction: "Compare prior seed state with newest transcript evidence. Output real diffs with importance labels. Carry forward unchanged facts.",
    injectionBehavior: "Injected first as delta: headline and top 4 changes. Highest injection priority.",
    renderBehavior: "Pulse view \u2014 expandable headline, change list, and carried/newly-established facts."
  },
  {
    key: "meters",
    label: "Diagnostic Meters",
    group: "Scene",
    core: false,
    intensity: "light",
    description: "Tension, danger, coherence, hidden information, and omen.",
    schemaSummary: "id (enum), label, value 0-100, pct, band, color, trend (enum), note",
    compilerInstruction: "Diagnose scene tension, danger, social heat, coherence, hidden info, and omen based on current narrative pressure. Never command escalation.",
    injectionBehavior: "Not injected by default. Moderate value for scene awareness.",
    renderBehavior: "Pulse view \u2014 compact meter grid with bars, trends, and band labels."
  },
  {
    key: "castCore",
    label: "Cast Core",
    group: "Cast",
    core: true,
    intensity: "heavy",
    description: "Presence, identity, intent, status, awareness, goals, anchors, and uncertainty.",
    schemaSummary: "id, name, kind, qty, role, location, status, awareness, threat, spotlight, emotionalState, intent, goals[], stableFacts[], continuity{}, changed, changeNote",
    compilerInstruction: "Track all named characters appearing in the scene. Maintain identity, presence, role, location, status, awareness, intent, goals, stable facts, and uncertainty. Mark changed=true and add changeNote when tracked state updates. Crowd/background groups are summarized compactly.",
    injectionBehavior: "Injected as cast.Name: status; intent; goal for POV/main/high-spotlight characters. Up to 6 entries.",
    renderBehavior: "Cast view \u2014 dense character ledger rows with expandable appearance and turn details."
  },
  {
    key: "appearance",
    label: "Immutable Appearance",
    group: "Cast",
    core: false,
    intensity: "medium",
    description: "Persistent adult physical identity: face, hair, eyes, height, weight, build, body shape, proportions, marks, attractive features, and unique traits.",
    schemaSummary: "castMatrix[].appearance{species, ageBand, apparentAge, genderPresentation, height, weight, build, bodyType, frame, proportions, silhouette, bodyComposition, shoulders, chest, bust, waist, hips, glutes, arms, legs, hands, skin, complexion, face, facialStructure, hair, eyes, eyebrows, nose, lips, ears, facialHair, posture, movement, voice, distinguishingMarks, scars, tattoos, piercings, birthmarks, uniqueFeatures, attractiveFeatures, immutableTraits[], presence, fullDescription, anchor}",
    compilerInstruction: "Create a rich persistent visual profile for every important named adult character using transcript and seed evidence. Describe hair color, length, texture and styling; eye color, shape and expression; facial shape and features; complexion and skin details; height and weight impression; frame, build, musculature or softness; shoulders, chest or bust, waist, hips, glute or seat shape, limbs, hands, posture, movement, voice, marks, scars, tattoos, piercings, attractive features, and unique identifiers when known. fullDescription should read as a coherent 3-6 sentence visual portrait, while anchor is a concise continuity lock. Preserve established traits until evidence changes them. Never invent exact measurements, cup sizes, numeric weight, hidden anatomy, or sexual details unsupported by the transcript. Only use body-shape and attractive-feature fields for confirmed or assumed adults; keep any minor or age-ambiguous description neutral and leave sexualized proportional fields empty.",
    injectionBehavior: "When enabled, injects a compact immutable appearance anchor for important cast members. Budget-aware.",
    renderBehavior: "Cast tab - dedicated expandable appearance profile with physical traits, proportions, identifying marks, and immutable anchors."
  },
  {
    key: "castVisuals",
    label: "Cast Visuals",
    group: "Cast",
    core: false,
    intensity: "light",
    description: "Pose, proximity, hands, visual anchor, and spotlight.",
    schemaSummary: "pose, proximity, hands, visualAnchor, spotlight{gauge}",
    compilerInstruction: "Update pose, proximity, hands, and spotlight from transcript evidence. Spotlight reflects narrative focus weight.",
    injectionBehavior: "Injected only if budget allows and imagePrompt or castVisuals inject is enabled.",
    renderBehavior: "Cast tab \u2014 shown in Current State section of character card. Visual anchor in Appearance section."
  },
  {
    key: "clothing",
    label: "Clothing",
    group: "Cast",
    core: false,
    intensity: "light",
    description: "Detailed wardrobe continuity with layers, fabrics, fit, coverage, footwear, accessories, styling, and condition.",
    schemaSummary: "summary, silhouette, palette, fabric, fit, condition, notable, styling, coverage, footwear, accessories, layerCount, layers[{slot, text, state, color}]",
    compilerInstruction: "Track each character's complete visible outfit in grounded detail and persist it until the transcript changes it. Describe every visible layer from outerwear through upper body, lower body, footwear, jewelry and accessories; include garment type, cut, color, pattern, material, texture, fit, coverage, closures, condition, wear, wetness, damage, stains, and how the outfit sits on or moves with the body. summary should be a coherent 2-4 sentence wardrobe description, while layers should preserve item-level continuity. Mark changed when any garment is added, removed, opened, shifted, damaged, wet, stained, or transferred.",
    injectionBehavior: "Included only if changed or currently plot-relevant. Budget-aware.",
    renderBehavior: "Cast tab \u2014 Clothing section in expandable details. Shows layers with slot labels."
  },
  {
    key: "relationships",
    label: "Relationships",
    group: "Cast",
    core: false,
    intensity: "medium",
    description: "Relationship targets, emotional axes, trends, and evidence.",
    schemaSummary: "relSummary, relationships[{target, axis, value -100..100, pct, label, color, trend, evidence}]",
    compilerInstruction: "Track character relationships on axes (Trust, Fear, Attraction, Rivalry, etc.). Value -100 (hostile) to 100 (devoted). Include evidence from transcript. Update trends on each turn.",
    injectionBehavior: "Included only if active in the current scene. Budget-aware.",
    renderBehavior: "Cast tab \u2014 Relationships section with value bars, trend indicators, evidence text."
  },
  {
    key: "inventory",
    label: "Inventory",
    group: "World",
    core: false,
    intensity: "medium",
    description: "Pockets, ownership, condition, and important room items.",
    schemaSummary: "pockets[{name, type: consumable/concealed/tool/key/evidence/misc, qty, condition, known, color, changed, changeNote}]",
    compilerInstruction: "Track known pocket inventory per character. Type categorizes the item. Mark changed when items are acquired, used, or transferred. Only known items visible to the POV.",
    injectionBehavior: "Injected as item.Name: name x qty; condition. Budget-aware, only known items.",
    renderBehavior: "Cast tab \u2014 Pockets section in expandable details. Scene items in World tab."
  },
  {
    key: "worldSpace",
    label: "World & Space",
    group: "World",
    core: false,
    intensity: "medium",
    description: "Privacy, observers, light, blocking, exits, and hazards.",
    schemaSummary: "privacy, observerCount, observerPressure{gauge}, crowdNoise, crowdFlow, light{primary,secondary,quality,color}, spatial[], access{exit,lineOfSight,noiseMask,items[],people[]}, carryover{body[],room[],social[]}, items[]",
    compilerInstruction: "Update spatial scene state each turn. Exit accessibility, light, crowd dynamics, and spatial facts. Carry over body/room/social context.",
    injectionBehavior: "Injected as access: exit; sight; noise plus spatial facts. Medium priority.",
    renderBehavior: "World tab \u2014 scene facts grid, spatial chips, carryover columns, scene items."
  },
  {
    key: "storyThreads",
    label: "Story Threads",
    group: "Story",
    core: true,
    intensity: "heavy",
    description: "Goals, conflicts, threads, stakes, countdowns, spotlight queue, and autonomy.",
    schemaSummary: "goals[]{who, goal, status, note}, conflicts[]{a, b, label, severity}, threadLoom[], stakes[], countdowns[], spotlightQueue[], autonomyQueue[]",
    compilerInstruction: "Track narrative threads with urgency, progress, and next pressure. Goals track character objectives. Spotlight queue tracks which characters need narrative attention. Countdowns tick toward consequences.",
    injectionBehavior: "Injected as thread.title: status/urgency + next pressure. Top urgent threads first. Stakes included for active parties.",
    renderBehavior: "Story tab \u2014 thread loom list, goals, stakes, countdowns, spotlight queue card, autonomy queue."
  },
  {
    key: "continuity",
    label: "Continuity Firewall",
    group: "Story",
    core: true,
    intensity: "heavy",
    description: "Facts, anchors, consequences, avoided moves, terms, and risks.",
    schemaSummary: "establishedFacts[], antiRetconAnchors[], pendingConsequences[{cause, pending, trigger, urgency, status, evidence, changed}], offscreenState[], bannedNext[{text, reason, scope, color, source}], impossibleNext[], risks[]{severity, issue, evidence, recommendation}, terms[{party, term, risk, status, binding, evidence}]",
    compilerInstruction: "Protect story coherence. Maintain established facts and anti-retcon anchors. Track pending narrative consequences with urgency and trigger conditions. Log avoided moves with reason and scope. Track character agreements/terms. Detect continuity conflicts as risks.",
    injectionBehavior: "Injected as anchor:, pending:, and risk. entries. High priority for continuity safety.",
    renderBehavior: "Memory view \u2014 metrics, risk cards, facts, anchors, consequences, terms, and avoid lists."
  },
  {
    key: "secretsRumors",
    label: "Secrets & Rumors",
    group: "World",
    core: false,
    intensity: "light",
    description: "Rumors, secrets, hints, and loaded signs/setups.",
    schemaSummary: "rumors[]{rumor, source, credibility, pct, color}, secrets[]{secret, visibleHint, knownBy[]}, loadedSigns[]{thing, plantedBy, payoffWhen, state, evidence, payoffHint, changed}",
    compilerInstruction: "Track rumors with credibility scores and sources. Secrets are reader-visible dramatic state. Loaded signs/setups track planted story elements with payoff conditions.",
    injectionBehavior: "Not injected by default. Low priority within budget.",
    renderBehavior: "World tab \u2014 rumors grid, secrets list, loaded signs with state badges."
  },
  {
    key: "actionResolver",
    label: "Action Resolver",
    group: "Tools",
    core: false,
    intensity: "medium",
    description: "Current action, world response, blockers, and risk.",
    schemaSummary: "userAction, worldResponse, risk, blockers[]",
    compilerInstruction: "Track the user's current action, its expected world response, risk assessment, and mechanical blockers.",
    injectionBehavior: "Injected as action: action; response; risk. Medium-high priority.",
    renderBehavior: "Pulse view \u2014 expandable action response, risk, and blocker details."
  },
  {
    key: "dialogueState",
    label: "Dialogue State",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Open thread, masks, levers, and taboos.",
    schemaSummary: "openThread, socialMask, levers[], taboos[]",
    compilerInstruction: "Track active dialogue threads, social masks characters are wearing, conversational levers, and established taboos.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Pulse view \u2014 dialogue card when enabled."
  },
  {
    key: "directorStyle",
    label: "Director Style",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Optional scene direction and voice cues.",
    schemaSummary: "primary, mask, push, voiceCues[]",
    compilerInstruction: "Track optional director-style scene framing, narrative mask, push direction, and voice cues for the writer.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Pulse view \u2014 director card when enabled."
  },
  {
    key: "closenessState",
    label: "Closeness State",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Non-explicit emotional and physical closeness.",
    schemaSummary: "emotional, physical, consentSignals[], boundaries[]",
    compilerInstruction: "Track non-explicit emotional and physical closeness between characters. Always PG. Focus on consent signals and established boundaries.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Pulse view \u2014 closeness card when enabled."
  },
  {
    key: "imagePrompt",
    label: "Image Prompt",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "A structured, production-ready GPT Image brief grounded in the exact scene, cast continuity, composition, and constraints.",
    schemaSummary: "aspect, shot, medium, subject, positive, negative, intent, composition, camera, lighting, colorPalette, environment, characterContinuity, action, materials, mood, textRendering, constraints[], full, hint",
    compilerInstruction: "Write a production-ready prompt optimized for OpenAI GPT Image. Use a consistent labeled order: intended use and visual goal; background and environment; subjects; exact adult character appearance and wardrobe continuity; pose, gaze, hands and object interactions; composition and placement; camera framing, viewpoint and perspective; lighting, atmosphere and color palette; materials and textures; medium and finish; then explicit constraints. Use concrete natural language rather than keyword stuffing. If photorealism is intended, say photorealistic or real photograph directly. Preserve transcript-grounded identities, clothing, geometry, spatial relationships, visible props and scene facts; never invent conflicting appearance details. State no watermark, no unintended text, no logos, no extra people or limbs, no cropped required body parts, and no continuity drift unless the scene requires otherwise. If text is requested, quote the exact text and placement; otherwise specify no text. full should normally be 350-800 words when sufficient scene evidence exists, organized with short labeled sections or line breaks. Keep it specific, coherent, and free of filler.",
    injectionBehavior: "Not injected by default. Consumes significant budget if enabled.",
    renderBehavior: "Pulse view \u2014 image prompt card with shot, medium, subject, and hint."
  },
  {
    key: "auditLog",
    label: "Audit Log",
    group: "System",
    core: false,
    intensity: "light",
    description: "Compact compiler and repair diagnostics.",
    schemaSummary: "system, marker, result, repaired, notes",
    compilerInstruction: "Log each compiler run: system name, identity marker, validation result, repair flag, and notes. Minimum verbosity.",
    injectionBehavior: "Not injected.",
    renderBehavior: "Memory view \u2014 expandable audit log list."
  }
];
function control(track, display = track, inject = false) {
  return { track, display, inject };
}
var BALANCED_MODULE_SETTINGS = {
  sceneKernel: control(true, true, true),
  deltas: control(true, true, true),
  meters: control(true, true, false),
  castCore: control(true, true, true),
  appearance: control(true, true, false),
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
function getEffectiveModuleCatalog(settings) {
  const overrides = settings?.stockModuleOverrides ?? {};
  return MODULE_CATALOG.map((module, index) => {
    const override = overrides[module.key];
    const baseCompilerInstruction = override?.compilerInstructionOverride ?? module.compilerInstruction;
    const compilerInstruction = override?.compilerGuidanceAddendum ? `${baseCompilerInstruction} [Additional guidance: ${override.compilerGuidanceAddendum}]`.trim() : baseCompilerInstruction;
    return {
      ...module,
      label: override?.label ?? module.label,
      description: override?.description ?? module.description,
      group: override?.group ?? module.group,
      schemaSummary: override?.schemaSummaryOverride ?? module.schemaSummary,
      compilerInstruction,
      icon: override?.icon ?? "",
      displayOrder: override?.displayOrder ?? index * 10,
      intensityLabel: override?.intensityLabel ?? module.intensity,
      hiddenFromSettings: override?.hiddenFromSettings ?? false,
      defaultControl: {
        ...BALANCED_MODULE_SETTINGS[module.key],
        display: override?.defaultDisplay ?? BALANCED_MODULE_SETTINGS[module.key].display,
        inject: override?.defaultInject ?? BALANCED_MODULE_SETTINGS[module.key].inject
      },
      overridden: Boolean(override && Object.keys(override).length > 0)
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
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
var PresetModuleSettingsSchema = external_exports.preprocess(
  (value) => normalizeModuleSettings(
    typeof value === "object" && value !== null ? value : void 0
  ),
  ModuleSettingsSchema
);
var CustomModulePresetSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  description: external_exports.string().trim().max(500).default(""),
  createdAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  moduleSettings: PresetModuleSettingsSchema
}).strict();
var CustomModuleFieldTypeSchema = external_exports.enum([
  "text",
  "longText",
  "number",
  "boolean",
  "enum",
  "gauge",
  "chips",
  "list"
]);
var CustomModuleFieldSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  label: external_exports.string().trim().min(1).max(160),
  key: external_exports.string().trim().regex(/^[A-Za-z][A-Za-z0-9_]*$/).max(80),
  type: CustomModuleFieldTypeSchema,
  required: external_exports.boolean().default(false),
  description: external_exports.string().trim().max(500).default(""),
  defaultValue: external_exports.unknown().optional(),
  enumOptions: external_exports.array(external_exports.string().trim().min(1).max(160)).max(30).default([]),
  maxItems: external_exports.number().int().min(1).max(50).optional(),
  min: external_exports.number().finite().optional(),
  max: external_exports.number().finite().optional(),
  displayHint: external_exports.string().trim().max(160).optional()
}).strict().superRefine((field, context) => {
  if (field.type === "enum" && field.enumOptions.length === 0) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["enumOptions"],
      message: "Enum fields require at least one option."
    });
  }
  if (field.min !== void 0 && field.max !== void 0 && field.min > field.max) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["min"],
      message: "Minimum cannot exceed maximum."
    });
  }
});
var CustomModuleSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  label: external_exports.string().trim().min(1).max(160),
  group: external_exports.string().trim().min(1).max(160).default("Custom"),
  description: external_exports.string().trim().max(500).default(""),
  enabled: external_exports.boolean().default(true),
  display: external_exports.boolean().default(true),
  inject: external_exports.boolean().default(true),
  compilerInstruction: external_exports.string().trim().max(1600),
  outputMode: external_exports.enum(["cards", "bullets", "chips", "gauge", "template"]).default("cards"),
  maxItems: external_exports.number().int().min(1).max(24).default(6),
  intensity: external_exports.enum(["light", "medium", "heavy", "experimental"]).default("medium"),
  displayOrder: external_exports.number().int().optional(),
  schemaFields: external_exports.array(CustomModuleFieldSchema).max(40).default([]),
  htmlTemplate: external_exports.string().max(8e3).default(""),
  cssTemplate: external_exports.string().max(8e3).default(""),
  templateEngine: external_exports.enum(["mustache-lite", "token-replace"]).default("mustache-lite"),
  allowHtmlTemplate: external_exports.boolean().default(false)
}).strict();
var StockModuleOverrideSchema = external_exports.object({
  label: external_exports.string().max(160).optional(),
  description: external_exports.string().max(500).optional(),
  group: external_exports.string().max(160).optional(),
  icon: external_exports.string().max(20).optional(),
  displayOrder: external_exports.number().int().optional(),
  intensityLabel: external_exports.string().max(40).optional(),
  defaultDisplay: external_exports.boolean().optional(),
  defaultInject: external_exports.boolean().optional(),
  compilerGuidanceAddendum: external_exports.string().max(1e3).optional(),
  compilerInstructionOverride: external_exports.string().max(6e3).optional(),
  schemaSummaryOverride: external_exports.string().max(6e3).optional(),
  injectionPriority: external_exports.number().int().optional(),
  renderHint: external_exports.string().max(200).optional(),
  hiddenFromSettings: external_exports.boolean().optional(),
  presentationEnabled: external_exports.boolean().optional(),
  htmlTemplate: external_exports.string().max(12e3).optional(),
  cssTemplate: external_exports.string().max(12e3).optional()
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
  injectionTokenBudget: external_exports.number().int().min(80).max(1e4).default(320),
  compilerSeedTokenBudget: external_exports.number().int().min(200).max(1e4).default(900),
  recentMessageLimit: external_exports.number().int().min(4).max(80).default(24),
  historyRetentionLimit: external_exports.number().int().min(1).max(1e3).default(100),
  generationTimeoutSeconds: external_exports.number().int().min(30).max(300).default(180),
  connectionId: external_exports.string().trim().max(200).default(""),
  viewerTemplateEnabled: external_exports.boolean().default(false),
  viewerHtmlTemplate: external_exports.string().max(16e3).default(""),
  viewerCssTemplate: external_exports.string().max(16e3).default(""),
  modulePreset: ModulePresetSchema.default("balanced"),
  moduleSettings: ModuleSettingsSchema.default(BALANCED_MODULE_SETTINGS),
  stockModuleOverrides: external_exports.record(external_exports.string(), StockModuleOverrideSchema).default({}),
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
    historyRetentionLimit: source.historyRetentionLimit,
    generationTimeoutSeconds: source.generationTimeoutSeconds,
    connectionId: source.connectionId,
    viewerTemplateEnabled: source.viewerTemplateEnabled,
    viewerHtmlTemplate: source.viewerHtmlTemplate,
    viewerCssTemplate: source.viewerCssTemplate,
    modulePreset: source.modulePreset,
    moduleSettings,
    stockModuleOverrides: source.stockModuleOverrides,
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
  type: external_exports.enum(["consumable", "concealed", "tool", "key", "evidence", "misc"]).default("misc"),
  qty: external_exports.number().int().nonnegative().max(9999),
  condition: ShortText,
  known: external_exports.boolean(),
  color: ColorText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var LayerSchema = external_exports.object({
  slot: external_exports.enum(["outer", "upper", "lower", "feet", "accessory", "other"]),
  text: ShortText,
  state: ShortText.optional(),
  color: ColorText.optional()
}).strict();
var RelationshipEntrySchema = external_exports.object({
  target: TinyText,
  axis: ShortText,
  value: external_exports.number().min(-100).max(100),
  pct: PercentText.optional(),
  label: TinyText.optional(),
  color: ColorText.optional(),
  trend: TrendSchema.optional(),
  evidence: MediumText.optional()
}).strict();
var UncertaintyEntrySchema = external_exports.object({
  claim: MediumText,
  confidence: external_exports.number().min(0).max(10),
  label: external_exports.enum(["UNKNOWN", "DOUBTFUL", "POSSIBLE", "LIKELY", "CONFIRMED"]).default("UNKNOWN"),
  handling: ShortText.optional()
}).strict();
var AppearanceSchema = external_exports.object({
  species: ShortText.optional(),
  ageBand: ShortText.optional(),
  apparentAge: ShortText.optional(),
  genderPresentation: ShortText.optional(),
  height: ShortText.optional(),
  weight: ShortText.optional(),
  build: ShortText.optional(),
  bodyType: ShortText.optional(),
  frame: ShortText.optional(),
  proportions: MediumText.optional(),
  silhouette: ShortText.optional(),
  bodyComposition: ShortText.optional(),
  shoulders: ShortText.optional(),
  chest: ShortText.optional(),
  bust: ShortText.optional(),
  waist: ShortText.optional(),
  hips: ShortText.optional(),
  glutes: ShortText.optional(),
  arms: ShortText.optional(),
  legs: ShortText.optional(),
  hands: ShortText.optional(),
  skin: ShortText.optional(),
  complexion: ShortText.optional(),
  face: ShortText.optional(),
  facialStructure: ShortText.optional(),
  hair: ShortText.optional(),
  eyes: ShortText.optional(),
  eyebrows: ShortText.optional(),
  nose: ShortText.optional(),
  lips: ShortText.optional(),
  ears: ShortText.optional(),
  facialHair: ShortText.optional(),
  voice: ShortText.optional(),
  movement: ShortText.optional(),
  posture: ShortText.optional(),
  distinguishingMarks: MediumText.optional(),
  scars: MediumText.optional(),
  tattoos: MediumText.optional(),
  piercings: MediumText.optional(),
  birthmarks: MediumText.optional(),
  uniqueFeatures: MediumText.optional(),
  attractiveFeatures: MediumText.optional(),
  immutableTraits: external_exports.array(ShortText).max(16).optional().default([]),
  presence: ShortText.optional(),
  fullDescription: MediumText.optional(),
  anchor: MediumText.optional()
}).strict();
var ClothingSchema = external_exports.object({
  summary: MediumText.optional(),
  silhouette: ShortText.optional(),
  palette: ShortText.optional(),
  fabric: MediumText.optional(),
  fit: MediumText.optional(),
  condition: MediumText.optional(),
  notable: MediumText.optional(),
  styling: MediumText.optional(),
  coverage: MediumText.optional(),
  footwear: MediumText.optional(),
  accessories: MediumText.optional(),
  layerCount: external_exports.number().int().min(0).max(8).optional().default(0),
  layers: external_exports.array(LayerSchema).max(8).optional().default([])
}).strict();
var CurrentStateSchema = external_exports.object({
  injury: ShortText.optional(),
  pose: ShortText.optional(),
  proximity: ShortText.optional(),
  leftHand: ShortText.optional(),
  rightHand: ShortText.optional(),
  emotion: ShortText.optional(),
  intent: MediumText.optional(),
  physicalTell: ShortText.optional(),
  socialPosition: ShortText.optional()
}).strict();
var CastContinuitySchema = external_exports.object({
  lastConfirmed: ShortText.optional(),
  sourceHint: ShortText.optional(),
  uncertainty: external_exports.array(UncertaintyEntrySchema).max(4).optional().default([])
}).strict();
var CastMemberSchema = external_exports.object({
  id: external_exports.string().trim().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  kind: external_exports.enum(["pov", "main", "npc", "crowd", "background"]),
  qty: external_exports.number().int().positive().max(1e4),
  role: ShortText,
  location: ShortText,
  status: ShortText,
  awareness: external_exports.enum(["none", "ambient", "watching", "alerted", "hostile"]),
  threat: GaugeSchema.omit({ value: true, trend: true }).extend({
    value: external_exports.number().min(0).max(10)
  }).strict(),
  spotlight: GaugeSchema,
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional(),
  appearance: AppearanceSchema.optional().default({}),
  clothing: ClothingSchema.optional().default({}),
  currentState: CurrentStateSchema.optional().default({}),
  emotionalState: ShortText.optional().default(""),
  intent: MediumText.optional().default(""),
  pose: ShortText.optional().default(""),
  proximity: ShortText.optional().default(""),
  hands: ShortText.optional().default(""),
  visualAnchor: MediumText.optional().default(""),
  identitySummary: MediumText.optional().default(""),
  clothingSummary: MediumText.optional().default(""),
  relSummary: ShortText.optional(),
  relationships: external_exports.array(RelationshipEntrySchema).max(6).optional().default([]),
  leverage: external_exports.array(ShortText).max(6).optional().default([]),
  pockets: external_exports.array(PocketItemSchema).max(6).optional().default([]),
  goals: external_exports.array(ShortText).max(6).optional().default([]),
  stableFacts: external_exports.array(ShortText).max(8).optional().default([]),
  continuity: CastContinuitySchema.optional().default({})
}).strict();
var SetupEntrySchema = external_exports.object({
  thing: ShortText,
  plantedBy: ShortText.optional(),
  payoffWhen: MediumText.optional(),
  state: external_exports.enum(["LOADED", "HEATING", "FIRED", "DORMANT"]).default("LOADED"),
  evidence: MediumText.optional(),
  payoffHint: ShortText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
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
  loadedSigns: external_exports.array(SetupEntrySchema).max(8).optional().default([])
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
var SpotlightQueueEntrySchema = external_exports.object({
  name: TinyText,
  turnsSince: external_exports.number().int().nonnegative().default(0),
  pct: PercentText.optional(),
  color: ColorText.optional(),
  need: external_exports.enum(["active", "soon", "okay", "quiet", "background"]).default("okay"),
  reason: ShortText.optional()
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
  }).strict()).max(8),
  spotlightQueue: external_exports.array(SpotlightQueueEntrySchema).max(12).optional().default([])
}).strict();
var ContinuityRiskSchema = external_exports.object({
  severity: external_exports.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText
}).strict();
var AvoidNextSchema = external_exports.object({
  text: MediumText,
  reason: ShortText.optional(),
  scope: external_exports.enum(["turn", "scene", "persistent"]).default("turn"),
  color: ColorText.optional(),
  source: external_exports.enum(["user", "system", "compiler"]).default("compiler")
}).strict();
var ConsequenceEntrySchema = external_exports.object({
  cause: ShortText,
  pending: MediumText,
  trigger: ShortText.optional(),
  urgency: external_exports.number().min(0).max(10).default(5),
  pct: PercentText.optional(),
  status: external_exports.enum(["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"]).default("PENDING"),
  evidence: MediumText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var TermEntrySchema = external_exports.object({
  party: TinyText,
  term: MediumText,
  risk: ShortText.optional(),
  status: external_exports.enum(["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"]).default("UNKNOWN"),
  binding: external_exports.boolean().optional().default(false),
  evidence: MediumText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var ContinuityFirewallSchema = external_exports.object({
  establishedFacts: external_exports.array(MediumText).max(40),
  antiRetconAnchors: external_exports.array(MediumText).max(30),
  pendingConsequences: external_exports.array(ConsequenceEntrySchema).max(30).optional().default([]),
  offscreenState: external_exports.array(MediumText).max(24),
  bannedNext: external_exports.array(AvoidNextSchema).max(12).optional().default([]),
  impossibleNext: external_exports.array(MediumText).max(12),
  risks: external_exports.array(ContinuityRiskSchema).max(24),
  terms: external_exports.array(TermEntrySchema).max(10).optional().default([])
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
    intent: MediumText.optional().default(""),
    composition: MediumText.optional().default(""),
    camera: MediumText.optional().default(""),
    lighting: MediumText.optional().default(""),
    colorPalette: MediumText.optional().default(""),
    environment: MediumText.optional().default(""),
    characterContinuity: external_exports.string().trim().max(4e3).optional().default(""),
    action: MediumText.optional().default(""),
    materials: MediumText.optional().default(""),
    mood: MediumText.optional().default(""),
    textRendering: MediumText.optional().default(""),
    constraints: external_exports.array(MediumText).max(16).optional().default([]),
    full: external_exports.string().trim().max(8e3),
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
  color: ColorText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var CustomModuleDataSchema = external_exports.object({
  moduleId: external_exports.string().min(1).max(160),
  label: ShortText,
  summary: MediumText.default(""),
  fields: external_exports.record(external_exports.unknown()).default({}),
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

// src/shared/normalizeCompiledState.ts
var CompiledStateNormalizationError = class extends Error {
  report;
  constructor(report) {
    super(report.issues.slice(0, 8).join("\n") || "Compiled state normalization failed.");
    this.name = "CompiledStateNormalizationError";
    this.report = report;
  }
};
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function cloneJson(value) {
  if (value === void 0) return {};
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return {};
  }
}
function asRecord(value) {
  return isRecord(value) ? value : {};
}
function mark(changes, path) {
  if (!changes.includes(path)) changes.push(path);
}
function textFromValue(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (!isRecord(value)) return "";
  for (const key of [
    "goal",
    "text",
    "summary",
    "title",
    "name",
    "issue",
    "description",
    "secret",
    "rumor",
    "action",
    "target",
    "label",
    "note",
    "value"
  ]) {
    if (value[key] !== void 0) {
      const extracted = textFromValue(value[key]);
      if (extracted) return extracted;
    }
  }
  return "";
}
function text(value, max, fallback = "") {
  return (textFromValue(value) || fallback).replace(/\s+/g, " ").trim().slice(0, max);
}
function numberValue(value, min, max, fallback) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, numeric));
}
function integerValue(value, min, max, fallback) {
  return Math.trunc(numberValue(value, min, max, fallback));
}
function booleanValue(value, fallback) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return fallback;
}
function enumValue(value, allowed, fallback) {
  return typeof value === "string" && allowed.includes(value) ? value : fallback;
}
function arrayValue(value) {
  if (Array.isArray(value)) return value;
  if (value === void 0 || value === null || value === "") return [];
  return [value];
}
function stringArray(value, maxItems, maxLength) {
  return arrayValue(value).map((item) => text(item, maxLength)).filter(Boolean).slice(0, maxItems);
}
function defaultGauge(maxValue = 100) {
  return {
    value: 0,
    pct: "0%",
    band: "unknown",
    color: "var(--loomos-muted)",
    trend: "unknown",
    note: ""
  };
}
function normalizeGauge(value, maxValue = 100) {
  const source = asRecord(value);
  const gauge = defaultGauge(maxValue);
  gauge.value = numberValue(source.value, 0, maxValue, 0);
  gauge.pct = text(source.pct, 12, `${Math.round(gauge.value / maxValue * 100)}%`);
  gauge.band = text(source.band, 160, "unknown");
  gauge.color = text(source.color, 40, "var(--loomos-muted)");
  gauge.trend = enumValue(source.trend, ["down", "steady", "up", "unknown"], "unknown");
  gauge.note = text(source.note, 500);
  return gauge;
}
function defaultKernel() {
  return {
    scene: "",
    location: "",
    timeframe: "",
    date: "",
    time: "",
    elapsed: "",
    weather: "",
    pov: "",
    tone: "",
    topic: "",
    theme: "",
    objective: "",
    summary: "",
    currentFocus: "",
    nextFocus: "",
    currentRisk: "",
    stopMode: "",
    stopWhy: "",
    constraints: []
  };
}
function normalizeKernel(value) {
  const source = asRecord(value);
  const result = defaultKernel();
  for (const key of [
    "scene",
    "location",
    "timeframe",
    "date",
    "time",
    "elapsed",
    "weather",
    "pov",
    "tone",
    "topic",
    "theme",
    "stopMode"
  ]) {
    result[key] = text(source[key], 500);
  }
  for (const key of [
    "objective",
    "summary",
    "currentFocus",
    "nextFocus",
    "currentRisk",
    "stopWhy"
  ]) {
    result[key] = text(source[key], 1600);
  }
  result.constraints = stringArray(source.constraints, 12, 500);
  return result;
}
function defaultDelta() {
  return {
    headline: "",
    changedModules: [],
    changes: [],
    carriedForward: [],
    newlyEstablished: []
  };
}
function normalizeDelta(value, enabledModules) {
  const source = asRecord(value);
  const result = defaultDelta();
  result.headline = text(source.headline, 1600);
  result.changedModules = arrayValue(source.changedModules).filter((item) => typeof item === "string" && MODULE_KEYS.includes(item)).filter((item) => enabledModules.includes(item)).slice(0, MODULE_KEYS.length);
  result.changes = arrayValue(source.changes).map((item) => {
    const row = asRecord(item);
    const rowText = text(row.text ?? item, 1600);
    if (!rowText) return null;
    return {
      text: rowText,
      age: text(row.age, 500),
      module: enumValue(row.module, MODULE_KEYS, "deltas"),
      importance: enumValue(row.importance, ["low", "medium", "high", "critical"], "medium")
    };
  }).filter((item) => Boolean(item)).slice(0, 6);
  result.carriedForward = stringArray(source.carriedForward, 6, 1600);
  result.newlyEstablished = stringArray(source.newlyEstablished, 6, 1600);
  return result;
}
function normalizePocket(value) {
  if (typeof value === "string") {
    const name2 = text(value, 160);
    return name2 ? { name: name2, type: "misc", qty: 1, condition: "", known: true } : null;
  }
  if (!isRecord(value)) return null;
  const name = text(value.name ?? value.item ?? value.title ?? value.text, 160);
  if (!name) return null;
  return {
    name,
    type: enumValue(
      value.type,
      ["consumable", "concealed", "tool", "key", "evidence", "misc"],
      "misc"
    ),
    qty: integerValue(value.qty ?? value.quantity, 0, 9999, 1),
    condition: text(value.condition, 500),
    known: booleanValue(value.known, true),
    ...text(value.color, 40) ? { color: text(value.color, 40) } : {},
    changed: booleanValue(value.changed, false),
    ...text(value.changeNote, 500) ? { changeNote: text(value.changeNote, 500) } : {}
  };
}
function normalizeRelationship(value) {
  if (typeof value === "string") {
    const target2 = text(value, 500);
    return target2 ? { target: target2, axis: "general", value: 0 } : null;
  }
  if (!isRecord(value)) return null;
  const target = text(value.target ?? value.name ?? value.text ?? value.summary, 500);
  if (!target) return null;
  const pct = text(value.pct, 12);
  const label = text(value.label, 160);
  const color = text(value.color, 40);
  const evidence = text(value.evidence, 1600);
  return {
    target,
    axis: text(value.axis ?? value.type, 500, "general"),
    value: numberValue(value.value, -100, 100, 0),
    ...pct ? { pct } : {},
    ...label ? { label } : {},
    ...color ? { color } : {},
    ...value.trend !== void 0 ? { trend: enumValue(value.trend, ["down", "steady", "up", "unknown"], "unknown") } : {},
    ...evidence ? { evidence } : {}
  };
}
function normalizeOptionalTextObject(value, fields) {
  const source = asRecord(value);
  return Object.fromEntries(fields.flatMap((field) => {
    const normalized = text(source[field], field === "fullDescription" || field === "anchor" ? 1600 : 500);
    return normalized ? [[field, normalized]] : [];
  }));
}
function normalizeAppearance(value) {
  const source = asRecord(value);
  const mediumFields = /* @__PURE__ */ new Set([
    "proportions",
    "distinguishingMarks",
    "scars",
    "tattoos",
    "piercings",
    "birthmarks",
    "uniqueFeatures",
    "attractiveFeatures",
    "fullDescription",
    "anchor"
  ]);
  const fields = [
    "species",
    "ageBand",
    "apparentAge",
    "genderPresentation",
    "height",
    "weight",
    "build",
    "bodyType",
    "frame",
    "proportions",
    "silhouette",
    "bodyComposition",
    "shoulders",
    "chest",
    "bust",
    "waist",
    "hips",
    "glutes",
    "arms",
    "legs",
    "hands",
    "skin",
    "complexion",
    "face",
    "facialStructure",
    "hair",
    "eyes",
    "eyebrows",
    "nose",
    "lips",
    "ears",
    "facialHair",
    "voice",
    "movement",
    "posture",
    "distinguishingMarks",
    "scars",
    "tattoos",
    "piercings",
    "birthmarks",
    "uniqueFeatures",
    "attractiveFeatures",
    "presence",
    "fullDescription",
    "anchor"
  ];
  return {
    ...Object.fromEntries(fields.flatMap((field) => {
      const normalized = text(source[field], mediumFields.has(field) ? 1600 : 500);
      return normalized ? [[field, normalized]] : [];
    })),
    immutableTraits: stringArray(source.immutableTraits, 16, 500)
  };
}
function normalizeClothing(value) {
  const source = asRecord(value);
  const layers = arrayValue(source.layers).map((item) => {
    const row = asRecord(item);
    const layerText = text(row.text ?? row.description ?? item, 500);
    if (!layerText) return null;
    const state = text(row.state, 500);
    const color = text(row.color, 40);
    return {
      slot: enumValue(
        row.slot,
        ["outer", "upper", "lower", "feet", "accessory", "other"],
        "other"
      ),
      text: layerText,
      ...state ? { state } : {},
      ...color ? { color } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  const mediumFields = /* @__PURE__ */ new Set([
    "summary",
    "fabric",
    "fit",
    "condition",
    "notable",
    "styling",
    "coverage",
    "footwear",
    "accessories"
  ]);
  const fields = [
    "summary",
    "silhouette",
    "palette",
    "fabric",
    "fit",
    "condition",
    "notable",
    "styling",
    "coverage",
    "footwear",
    "accessories"
  ];
  return {
    ...Object.fromEntries(fields.flatMap((field) => {
      const normalized = text(source[field], mediumFields.has(field) ? 1600 : 500);
      return normalized ? [[field, normalized]] : [];
    })),
    layerCount: integerValue(source.layerCount, 0, 8, layers.length),
    layers
  };
}
function normalizeCastContinuity(value) {
  const source = asRecord(value);
  const uncertainty = arrayValue(source.uncertainty).map((item) => {
    const row = asRecord(item);
    const claim = text(row.claim ?? row.text ?? item, 1600);
    if (!claim) return null;
    const handling = text(row.handling, 500);
    return {
      claim,
      confidence: numberValue(row.confidence, 0, 10, 0),
      label: enumValue(
        row.label,
        ["UNKNOWN", "DOUBTFUL", "POSSIBLE", "LIKELY", "CONFIRMED"],
        "UNKNOWN"
      ),
      ...handling ? { handling } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 4);
  const lastConfirmed = text(source.lastConfirmed, 500);
  const sourceHint = text(source.sourceHint, 500);
  return {
    ...lastConfirmed ? { lastConfirmed } : {},
    ...sourceHint ? { sourceHint } : {},
    uncertainty
  };
}
function defaultCastMember(partial = {}) {
  const name = text(partial.name, 160, "Unknown");
  return {
    id: text(partial.id, 160, name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unknown"),
    name,
    kind: "npc",
    qty: 1,
    role: "",
    location: "",
    status: "",
    emotionalState: "",
    intent: "",
    pose: "",
    proximity: "",
    hands: "",
    awareness: "ambient",
    threat: {
      value: 0,
      pct: "0%",
      band: "unknown",
      color: "var(--loomos-muted)",
      note: ""
    },
    spotlight: defaultGauge(),
    visualAnchor: "",
    identitySummary: "",
    clothingSummary: "",
    goals: [],
    relationships: [],
    leverage: [],
    pockets: [],
    stableFacts: []
  };
}
function normalizeCastMember(value, index) {
  const source = asRecord(value);
  if (!Object.keys(source).length && typeof value !== "string") return null;
  const base = defaultCastMember({
    name: source.name ?? (typeof value === "string" ? value : `Unknown ${index + 1}`),
    id: source.id
  });
  base.kind = enumValue(source.kind, ["pov", "main", "npc", "crowd", "background"], "npc");
  base.qty = integerValue(source.qty, 1, 1e4, 1);
  base.role = text(source.role, 500);
  base.location = text(source.location, 500);
  base.status = text(source.status, 500);
  base.emotionalState = text(source.emotionalState, 500);
  base.intent = text(source.intent, 1600);
  base.pose = text(source.pose, 500);
  base.proximity = text(source.proximity, 500);
  base.hands = text(source.hands, 500);
  base.awareness = enumValue(source.awareness, ["none", "ambient", "watching", "alerted", "hostile"], "ambient");
  const threat = normalizeGauge(source.threat, 10);
  base.threat = {
    value: threat.value,
    pct: threat.pct,
    band: threat.band,
    color: threat.color,
    note: threat.note
  };
  base.spotlight = normalizeGauge(source.spotlight);
  base.visualAnchor = text(source.visualAnchor, 1600);
  base.identitySummary = text(source.identitySummary, 1600);
  base.clothingSummary = text(source.clothingSummary, 1600);
  base.goals = stringArray(source.goals, 6, 500);
  base.relationships = arrayValue(source.relationships).map(normalizeRelationship).filter((item) => Boolean(item)).slice(0, 8);
  base.leverage = stringArray(source.leverage, 6, 500);
  base.pockets = arrayValue(source.pockets).map(normalizePocket).filter((item) => Boolean(item)).slice(0, 6);
  base.stableFacts = stringArray(source.stableFacts, 6, 500);
  const changeNote = text(source.changeNote, 500);
  const relSummary = text(source.relSummary, 500);
  return {
    ...base,
    changed: booleanValue(source.changed, false),
    ...changeNote ? { changeNote } : {},
    appearance: normalizeAppearance(source.appearance),
    clothing: normalizeClothing(source.clothing),
    currentState: normalizeOptionalTextObject(source.currentState, [
      "injury",
      "pose",
      "proximity",
      "leftHand",
      "rightHand",
      "emotion",
      "intent",
      "physicalTell",
      "socialPosition"
    ]),
    ...relSummary ? { relSummary } : {},
    continuity: normalizeCastContinuity(source.continuity)
  };
}
function normalizeSceneItem(value) {
  if (typeof value === "string") {
    const name2 = text(value, 160);
    return name2 ? { name: name2, owner: "", location: "", condition: "", lastTouch: "", importance: "medium" } : null;
  }
  if (!isRecord(value)) return null;
  const name = text(value.name ?? value.title ?? value.text, 160);
  if (!name) return null;
  return {
    name,
    owner: text(value.owner, 160),
    location: text(value.location, 500),
    condition: text(value.condition, 500),
    lastTouch: text(value.lastTouch, 500),
    importance: enumValue(value.importance, ["low", "medium", "high", "critical"], "medium")
  };
}
function defaultScene() {
  return {
    privacy: "semi-private",
    observerCount: 0,
    observerPressure: defaultGauge(10),
    crowdNoise: "",
    crowdFlow: "",
    light: {
      primary: "",
      secondary: "",
      quality: "",
      color: ""
    },
    spatial: [],
    access: {
      exit: "FREE",
      lineOfSight: "",
      noiseMask: "",
      items: [],
      people: []
    },
    carryover: {
      body: [],
      room: [],
      social: []
    },
    items: []
  };
}
function normalizeScene(value) {
  const source = asRecord(value);
  const result = defaultScene();
  result.privacy = enumValue(source.privacy, ["private", "semi-private", "public", "exposed"], "semi-private");
  result.observerCount = integerValue(source.observerCount, 0, 1e4, 0);
  result.observerPressure = normalizeGauge(source.observerPressure, 10);
  result.crowdNoise = text(source.crowdNoise, 500);
  result.crowdFlow = text(source.crowdFlow, 500);
  const light = asRecord(source.light);
  result.light = {
    primary: text(light.primary, 500),
    secondary: text(light.secondary, 500),
    quality: text(light.quality, 500),
    color: text(light.color, 40)
  };
  result.spatial = stringArray(source.spatial, 8, 1600);
  const access = asRecord(source.access);
  result.access = {
    exit: enumValue(access.exit, ["FREE", "WATCHED", "BLOCKED"], "FREE"),
    lineOfSight: text(access.lineOfSight, 500),
    noiseMask: text(access.noiseMask, 500),
    items: stringArray(access.items, 5, 500),
    people: stringArray(access.people, 5, 500)
  };
  const carryover = asRecord(source.carryover);
  result.carryover = {
    body: stringArray(carryover.body, 5, 500),
    room: stringArray(carryover.room, 5, 500),
    social: stringArray(carryover.social, 5, 500)
  };
  result.items = arrayValue(source.items).map(normalizeSceneItem).filter((item) => Boolean(item)).slice(0, 10);
  return result;
}
function defaultWorldState() {
  return {
    recentEnvironmentalChanges: [],
    activeHazards: [],
    rumors: [],
    secrets: [],
    loadedSigns: []
  };
}
function normalizeWorldState(value) {
  const source = asRecord(value);
  const result = defaultWorldState();
  result.recentEnvironmentalChanges = stringArray(source.recentEnvironmentalChanges, 6, 1600);
  result.activeHazards = stringArray(source.activeHazards, 6, 1600);
  result.rumors = arrayValue(source.rumors).map((item) => {
    const row = asRecord(item);
    const rumor = text(row.rumor ?? item, 1600);
    if (!rumor) return null;
    const credibility = numberValue(row.credibility, 0, 10, 0);
    return {
      rumor,
      source: text(row.source, 500),
      credibility,
      pct: text(row.pct, 12, `${Math.round(credibility * 10)}%`),
      color: text(row.color, 40, "var(--loomos-muted)")
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  result.secrets = arrayValue(source.secrets).map((item) => {
    const row = asRecord(item);
    const secret = text(row.secret ?? item, 1600);
    if (!secret) return null;
    return {
      secret,
      visibleHint: text(row.visibleHint, 1600),
      knownBy: stringArray(row.knownBy, 6, 160)
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  result.loadedSigns = arrayValue(source.loadedSigns).map((item) => {
    const row = asRecord(item);
    const thing = text(row.thing ?? row.name ?? item, 500);
    if (!thing) return null;
    return {
      thing,
      ...text(row.plantedBy ?? row.loadedBy, 500) ? { plantedBy: text(row.plantedBy ?? row.loadedBy, 500) } : {},
      ...text(row.payoffWhen ?? row.firesWhen, 1600) ? { payoffWhen: text(row.payoffWhen ?? row.firesWhen, 1600) } : {},
      state: enumValue(row.state, ["LOADED", "HEATING", "FIRED", "DORMANT"], "LOADED"),
      ...text(row.evidence, 1600) ? { evidence: text(row.evidence, 1600) } : {},
      ...text(row.payoffHint, 500) ? { payoffHint: text(row.payoffHint, 500) } : {},
      changed: booleanValue(row.changed, false),
      ...text(row.changeNote, 500) ? { changeNote: text(row.changeNote, 500) } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  return result;
}
function defaultStoryState() {
  return {
    goals: [],
    conflicts: [],
    threadLoom: [],
    stakes: [],
    countdowns: [],
    spotlightQueue: [],
    autonomyQueue: []
  };
}
function normalizeStoryState(value) {
  const source = asRecord(value);
  const result = defaultStoryState();
  result.goals = arrayValue(source.goals).map((item) => {
    if (typeof item === "string") {
      const goal2 = text(item, 1600);
      return goal2 ? { who: "Unknown", goal: goal2, status: "ACTIVE", note: "" } : null;
    }
    const row = asRecord(item);
    const goal = text(row.goal ?? row.text ?? row.summary ?? row.title, 1600);
    if (!goal) return null;
    return {
      who: text(row.who, 160, "Unknown"),
      goal,
      status: enumValue(row.status, ["ACTIVE", "BLOCKED", "PROGRESSED", "RESOLVED"], "ACTIVE"),
      note: text(row.note, 1600)
    };
  }).filter((item) => Boolean(item)).slice(0, 10);
  result.conflicts = arrayValue(source.conflicts).map((item) => {
    const row = asRecord(item);
    const label = text(row.label ?? row.text ?? item, 500);
    if (!label) return null;
    return {
      a: text(row.a, 160),
      b: text(row.b, 160),
      label,
      severity: integerValue(row.severity, 1, 3, 1)
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  result.threadLoom = arrayValue(source.threadLoom).map((item) => {
    const row = asRecord(item);
    const title = text(row.title ?? row.name ?? row.text, 240);
    if (!title) return null;
    const progress = numberValue(row.progress, 0, 10, 0);
    return {
      title,
      status: enumValue(row.status, ["dormant", "active", "escalating", "blocked", "resolved"], "active"),
      urgency: integerValue(row.urgency, 0, 5, 0),
      priority: enumValue(row.priority, ["low", "medium", "high", "critical"], "medium"),
      progress,
      pct: text(row.pct, 12, `${Math.round(progress * 10)}%`),
      color: text(row.color, 40, "var(--loomos-muted)"),
      label: text(row.label, 160, "active"),
      summary: text(row.summary, 1600),
      nextPressure: text(row.nextPressure, 1600),
      participants: stringArray(row.participants, 12, 160)
    };
  }).filter((item) => Boolean(item)).slice(0, 24);
  result.stakes = arrayValue(source.stakes).map((item) => {
    const row = asRecord(item);
    const who = text(row.who, 160);
    const win = text(row.win, 1600);
    const lose = text(row.lose, 1600);
    return who || win || lose ? { who, win, lose } : null;
  }).filter((item) => Boolean(item)).slice(0, 8);
  result.countdowns = arrayValue(source.countdowns).map((item) => {
    const row = asRecord(item);
    const title = text(row.title ?? row.name ?? item, 500);
    if (!title) return null;
    return {
      title,
      left: numberValue(row.left, 0, Number.MAX_SAFE_INTEGER, 0),
      unit: text(row.unit, 160),
      pct: text(row.pct, 12, "0%"),
      color: text(row.color, 40, "var(--loomos-muted)")
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  result.spotlightQueue = arrayValue(source.spotlightQueue).map((item) => {
    const row = asRecord(item);
    const name = text(row.name ?? row.who ?? item, 160);
    if (!name) return null;
    const pct = text(row.pct, 12);
    const color = text(row.color, 40);
    const reason = text(row.reason, 500);
    return {
      name,
      turnsSince: integerValue(row.turnsSince, 0, Number.MAX_SAFE_INTEGER, 0),
      ...pct ? { pct } : {},
      ...color ? { color } : {},
      need: enumValue(row.need, ["active", "soon", "okay", "quiet", "background"], "okay"),
      ...reason ? { reason } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 12);
  result.autonomyQueue = arrayValue(source.autonomyQueue).map((item) => {
    const row = asRecord(item);
    const action = text(row.action ?? row.text ?? item, 1600);
    if (!action) return null;
    return {
      who: text(row.who, 160, "Unknown"),
      action,
      unlessInterruptedBy: text(row.unlessInterruptedBy, 1600)
    };
  }).filter((item) => Boolean(item)).slice(0, 8);
  return result;
}
function defaultContinuityFirewall() {
  return {
    establishedFacts: [],
    antiRetconAnchors: [],
    pendingConsequences: [],
    offscreenState: [],
    bannedNext: [],
    impossibleNext: [],
    risks: [],
    terms: []
  };
}
function normalizeContinuityFirewall(value) {
  const source = asRecord(value);
  const result = defaultContinuityFirewall();
  result.establishedFacts = stringArray(source.establishedFacts, 40, 1600);
  result.antiRetconAnchors = stringArray(source.antiRetconAnchors, 30, 1600);
  result.pendingConsequences = arrayValue(source.pendingConsequences).map((item) => {
    const row = asRecord(item);
    const pending = text(row.pending ?? row.text ?? row.summary ?? item, 1600);
    const cause = text(row.cause ?? row.reason ?? pending, 500);
    if (!pending && !cause) return null;
    const trigger = text(row.trigger, 500);
    const pct = text(row.pct, 12);
    const evidence = text(row.evidence, 1600);
    const changeNote = text(row.changeNote, 500);
    return {
      cause: cause || pending.slice(0, 500),
      pending: pending || cause,
      ...trigger ? { trigger } : {},
      urgency: numberValue(row.urgency, 0, 10, 5),
      ...pct ? { pct } : {},
      status: enumValue(row.status, ["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"], "PENDING"),
      ...evidence ? { evidence } : {},
      changed: booleanValue(row.changed, false),
      ...changeNote ? { changeNote } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 30);
  result.offscreenState = stringArray(source.offscreenState, 24, 1600);
  result.bannedNext = arrayValue(source.bannedNext).map((item) => {
    if (typeof item === "string") {
      const rowText2 = text(item, 1600);
      return rowText2 ? { text: rowText2, scope: "turn", source: "compiler" } : null;
    }
    const row = asRecord(item);
    const rowText = text(row.text ?? row.issue ?? row.summary, 1600);
    if (!rowText) return null;
    const reason = text(row.reason, 500);
    const color = text(row.color, 40);
    return {
      text: rowText,
      ...reason ? { reason } : {},
      scope: enumValue(
        row.scope,
        ["turn", "scene", "persistent"],
        booleanValue(row.persistent, false) ? "persistent" : "turn"
      ),
      ...color ? { color } : {},
      source: enumValue(row.source, ["user", "system", "compiler"], "compiler")
    };
  }).filter((item) => Boolean(item)).slice(0, 12);
  result.impossibleNext = stringArray(source.impossibleNext, 12, 1600);
  result.risks = arrayValue(source.risks).map((item) => {
    if (typeof item === "string") {
      const issue2 = text(item, 1600);
      return issue2 ? { severity: "medium", issue: issue2, evidence: "", recommendation: "" } : null;
    }
    const row = asRecord(item);
    const issue = text(row.issue ?? row.text ?? row.summary, 1600);
    if (!issue) return null;
    return {
      severity: enumValue(row.severity, ["low", "medium", "high", "critical"], "medium"),
      issue,
      evidence: text(row.evidence, 1600),
      recommendation: text(row.recommendation, 1600)
    };
  }).filter((item) => Boolean(item)).slice(0, 24);
  result.terms = arrayValue(source.terms).map((item) => {
    const row = asRecord(item);
    const term = text(row.term ?? row.text ?? row.summary ?? item, 1600);
    const party = text(row.party ?? row.who, 160, "Unknown");
    if (!term) return null;
    const risk = text(row.risk, 500);
    const evidence = text(row.evidence, 1600);
    const changeNote = text(row.changeNote, 500);
    return {
      party,
      term,
      ...risk ? { risk } : {},
      status: enumValue(
        row.status,
        ["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"],
        "UNKNOWN"
      ),
      binding: booleanValue(row.binding, false),
      ...evidence ? { evidence } : {},
      changed: booleanValue(row.changed, false),
      ...changeNote ? { changeNote } : {}
    };
  }).filter((item) => Boolean(item)).slice(0, 10);
  return result;
}
function defaultTools() {
  return {
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null
  };
}
function normalizeTools(value) {
  const source = asRecord(value);
  const result = defaultTools();
  if (isRecord(source.actionResolver)) {
    result.actionResolver = {
      userAction: text(source.actionResolver.userAction, 1600),
      worldResponse: text(source.actionResolver.worldResponse, 1600),
      risk: text(source.actionResolver.risk, 1600),
      blockers: stringArray(source.actionResolver.blockers, 6, 500)
    };
  }
  if (isRecord(source.dialogueState)) {
    result.dialogueState = {
      openThread: text(source.dialogueState.openThread, 1600),
      socialMask: text(source.dialogueState.socialMask, 1600),
      levers: stringArray(source.dialogueState.levers, 6, 500),
      taboos: stringArray(source.dialogueState.taboos, 6, 500)
    };
  }
  if (isRecord(source.directorStyle)) {
    result.directorStyle = {
      primary: text(source.directorStyle.primary, 500),
      mask: text(source.directorStyle.mask, 500),
      push: text(source.directorStyle.push, 1600),
      voiceCues: stringArray(source.directorStyle.voiceCues, 6, 500)
    };
  }
  if (isRecord(source.closenessState)) {
    result.closenessState = {
      emotional: text(source.closenessState.emotional, 500),
      physical: text(source.closenessState.physical, 500),
      consentSignals: stringArray(source.closenessState.consentSignals, 6, 500),
      boundaries: stringArray(source.closenessState.boundaries, 6, 500)
    };
  }
  if (isRecord(source.imagePrompt)) {
    result.imagePrompt = {
      aspect: text(source.imagePrompt.aspect, 160),
      shot: text(source.imagePrompt.shot, 500),
      medium: text(source.imagePrompt.medium, 500),
      subject: text(source.imagePrompt.subject, 1600),
      positive: text(source.imagePrompt.positive, 1600),
      negative: text(source.imagePrompt.negative, 1600),
      intent: text(source.imagePrompt.intent, 1600),
      composition: text(source.imagePrompt.composition, 1600),
      camera: text(source.imagePrompt.camera, 1600),
      lighting: text(source.imagePrompt.lighting, 1600),
      colorPalette: text(source.imagePrompt.colorPalette, 1600),
      environment: text(source.imagePrompt.environment, 1600),
      characterContinuity: text(source.imagePrompt.characterContinuity, 4e3),
      action: text(source.imagePrompt.action, 1600),
      materials: text(source.imagePrompt.materials, 1600),
      mood: text(source.imagePrompt.mood, 1600),
      textRendering: text(source.imagePrompt.textRendering, 1600),
      constraints: stringArray(source.imagePrompt.constraints, 16, 1600),
      full: text(source.imagePrompt.full, 8e3),
      hint: text(source.imagePrompt.hint, 1600)
    };
  }
  return result;
}
function normalizeCustomField(value, field) {
  if (value === void 0 || value === null || value === "") {
    if (field.defaultValue !== void 0) return cloneJson(field.defaultValue);
    if (field.type === "number") return field.min ?? 0;
    if (field.type === "boolean") return false;
    if (field.type === "enum") return field.enumOptions[0] ?? "";
    if (field.type === "gauge") return defaultGauge(field.max ?? 100);
    if (field.type === "chips" || field.type === "list") return [];
    return "";
  }
  if (field.type === "text") return text(value, 500);
  if (field.type === "longText") return text(value, 1600);
  if (field.type === "number") {
    return numberValue(value, field.min ?? -1e6, field.max ?? 1e6, Number(field.defaultValue) || 0);
  }
  if (field.type === "boolean") return booleanValue(value, Boolean(field.defaultValue));
  if (field.type === "enum") return enumValue(value, field.enumOptions, field.enumOptions[0] ?? "");
  if (field.type === "gauge") return normalizeGauge(value, field.max ?? 100);
  if (field.type === "chips") return stringArray(value, field.maxItems ?? 24, 160);
  if (field.type === "list") {
    return arrayValue(value).filter((item) => typeof item === "string" || isRecord(item)).slice(0, field.maxItems ?? 24).map((item) => typeof item === "string" ? text(item, 1600) : cloneJson(item));
  }
  return value;
}
function normalizeCustomModuleData(value, customModules) {
  return arrayValue(value).map((item) => {
    const row = asRecord(item);
    const moduleId = text(row.moduleId ?? row.id, 160);
    if (!moduleId) return null;
    const module = customModules.find((candidate) => candidate.id === moduleId);
    const fieldsSource = asRecord(row.fields);
    const fields = module ? Object.fromEntries(module.schemaFields.map((field) => [
      field.key,
      normalizeCustomField(fieldsSource[field.key], field)
    ])) : Object.fromEntries(Object.entries(fieldsSource).slice(0, 40));
    const items = arrayValue(row.items).map((entry) => {
      if (typeof entry === "string") {
        const entryText = text(entry, 1600);
        return entryText ? {
          title: entryText.slice(0, 80),
          text: entryText,
          importance: "medium"
        } : null;
      }
      const itemRow = asRecord(entry);
      const itemText = text(itemRow.text ?? itemRow.summary ?? itemRow.description ?? itemRow.title, 1600);
      const title = text(itemRow.title ?? itemRow.name ?? itemText, 500);
      if (!title && !itemText) return null;
      const color = text(itemRow.color, 40);
      return {
        title: title || itemText.slice(0, 80),
        text: itemText,
        importance: enumValue(itemRow.importance, ["low", "medium", "high", "critical"], "medium"),
        ...color ? { color } : {}
      };
    }).filter((entry) => Boolean(entry)).slice(0, module?.maxItems ?? 24);
    return {
      moduleId,
      label: text(row.label, 500, module?.label ?? moduleId),
      summary: text(row.summary, 1600),
      fields,
      items
    };
  }).filter((item) => Boolean(item)).slice(0, 80);
}
function normalizeCompiledState(value, options) {
  const cloned = cloneJson(value);
  const source = asRecord(cloned);
  const changes = [];
  if (!isRecord(cloned)) mark(changes, "root");
  const enabled = options.enabledModules.filter((key) => MODULE_KEYS.includes(key));
  const activeModules = arrayValue(source.activeModules).filter((item) => typeof item === "string" && MODULE_KEYS.includes(item)).filter((item) => enabled.includes(item));
  const normalizedActive = activeModules.length > 0 ? activeModules : enabled;
  if (JSON.stringify(source.activeModules) !== JSON.stringify(normalizedActive)) mark(changes, "activeModules");
  const wantsScene = enabled.some((key) => ["worldSpace", "inventory"].includes(key));
  const wantsWorld = enabled.some((key) => ["worldSpace", "secretsRumors"].includes(key));
  const normalized = {
    activeModules: normalizedActive,
    kernel: normalizeKernel(source.kernel),
    delta: normalizeDelta(source.delta, enabled),
    meters: arrayValue(source.meters).map((item) => {
      const row = asRecord(item);
      const id = enumValue(row.id, ["tension", "danger", "socialHeat", "coherence", "hiddenInfo", "omen"], "");
      if (!id) return null;
      return {
        id,
        label: text(row.label, 160, id),
        ...normalizeGauge(row)
      };
    }).filter((item) => Boolean(item)).slice(0, 6),
    scene: source.scene !== null && (isRecord(source.scene) || wantsScene) ? normalizeScene(source.scene) : null,
    castMatrix: arrayValue(source.castMatrix).map(normalizeCastMember).filter((item) => Boolean(item)).slice(0, 24),
    worldState: source.worldState !== null && (isRecord(source.worldState) || wantsWorld) ? normalizeWorldState(source.worldState) : null,
    storyState: normalizeStoryState(source.storyState),
    continuityFirewall: normalizeContinuityFirewall(source.continuityFirewall),
    tools: normalizeTools(source.tools),
    auditLog: arrayValue(source.auditLog).map((item) => {
      const row = asRecord(item);
      const system = text(row.system, 160);
      const result = text(row.result ?? item, 500);
      if (!system && !result) return null;
      return {
        system: system || "compiler",
        marker: text(row.marker, 160),
        result,
        repaired: booleanValue(row.repaired, false),
        notes: text(row.notes, 1600)
      };
    }).filter((item) => Boolean(item)).slice(0, 12),
    customModuleData: normalizeCustomModuleData(source.customModuleData, options.customModules ?? [])
  };
  const parsed = LoomOSCompiledStateSchema.safeParse(normalized);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (issue) => `${issue.path.join(".") || "root"}: ${issue.message}`
    );
    throw new CompiledStateNormalizationError({
      normalized: true,
      changes,
      issues
    });
  }
  return {
    state: parsed.data,
    report: {
      normalized: changes.length > 0 || JSON.stringify(cloned) !== JSON.stringify(parsed.data),
      changes,
      issues: []
    }
  };
}
function transcriptKernel(transcript) {
  const lines = transcript.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("["));
  const summary = lines.slice(-2).join(" ").replace(/\s+/g, " ").slice(0, 1600);
  return {
    ...defaultKernel(),
    scene: summary.slice(0, 500),
    summary,
    currentFocus: summary
  };
}
function buildFallbackCompiledState(request) {
  const seed = request.seedState;
  const kernel = seed ? {
    ...defaultKernel(),
    scene: seed.kernel.scene,
    location: seed.kernel.location,
    timeframe: seed.kernel.timeframe,
    date: seed.kernel.date,
    time: seed.kernel.time,
    elapsed: seed.kernel.elapsed,
    weather: seed.kernel.weather,
    pov: seed.kernel.pov,
    tone: seed.kernel.tone,
    topic: seed.kernel.topic,
    theme: seed.kernel.theme,
    objective: seed.kernel.objective,
    summary: seed.kernel.summary,
    currentFocus: seed.kernel.currentFocus,
    currentRisk: seed.kernel.currentRisk,
    constraints: seed.kernel.constraints.slice(0, 12)
  } : transcriptKernel(request.transcript);
  return LoomOSCompiledStateSchema.parse({
    activeModules: request.enabledModules,
    kernel,
    delta: {
      ...defaultDelta(),
      headline: "Compiler output was invalid; saved minimal fallback state."
    },
    meters: [],
    scene: null,
    castMatrix: [],
    worldState: null,
    storyState: defaultStoryState(),
    continuityFirewall: seed ? {
      ...defaultContinuityFirewall(),
      establishedFacts: seed.continuityFirewall.establishedFacts.slice(0, 20),
      antiRetconAnchors: seed.continuityFirewall.antiRetconAnchors.slice(0, 15),
      pendingConsequences: seed.continuityFirewall.pendingConsequences.slice(0, 15),
      offscreenState: seed.continuityFirewall.offscreenState.slice(0, 12)
    } : defaultContinuityFirewall(),
    tools: defaultTools(),
    auditLog: [{
      system: "compiler",
      marker: "normalization_v2",
      result: "fallback_state_saved",
      repaired: true,
      notes: text(request.notes, 1600)
    }],
    customModuleData: []
  });
}

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
    "status":"","awareness":"ambient","changed":false,
    "threat":{"value":0,"pct":"0%","band":"","color":"","note":""},
    "spotlight":{"value":0,"pct":"0%","band":"","color":"","trend":"unknown","note":""},
    "appearance":{
      "species":"","ageBand":"","apparentAge":"","genderPresentation":"",
      "height":"","weight":"","build":"","bodyType":"","frame":"",
      "proportions":"","silhouette":"","bodyComposition":"",
      "shoulders":"","chest":"","bust":"","waist":"","hips":"","glutes":"",
      "arms":"","legs":"","hands":"","skin":"","complexion":"",
      "face":"","facialStructure":"","hair":"","eyes":"","eyebrows":"",
      "nose":"","lips":"","ears":"","facialHair":"","voice":"",
      "movement":"","posture":"","distinguishingMarks":"","scars":"",
      "tattoos":"","piercings":"","birthmarks":"","uniqueFeatures":"",
      "attractiveFeatures":"",
      "immutableTraits":[],"presence":"","fullDescription":"","anchor":""
    },
    "clothing":{
      "summary":"","silhouette":"","palette":"","fabric":"","fit":"",
      "condition":"","notable":"","styling":"","coverage":"",
      "footwear":"","accessories":"","layerCount":0,"layers":[]
    },
    "currentState":{"pose":"","proximity":"","leftHand":"","rightHand":"","emotion":"","intent":"","injury":""},
    "emotionalState":"","intent":"","pose":"","proximity":"","hands":"",
    "visualAnchor":"","identitySummary":"","clothingSummary":"",
    "goals":[],"relationships":[],"leverage":[],"pockets":[],"stableFacts":[],"continuity":{}
  }],
  "worldState": {
    "recentEnvironmentalChanges":[],"activeHazards":[],
    "rumors":[{"rumor":"","source":"","credibility":0,"pct":"0%","color":""}],
    "secrets":[{"secret":"","visibleHint":"","knownBy":[]}],
    "loadedSigns":[{"thing":"","plantedBy":"","payoffWhen":"","state":"LOADED","payoffHint":""}]
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
    "spotlightQueue":[{"name":"","turnsSince":0,"need":"okay","reason":""}],
    "autonomyQueue":[{"who":"","action":"","unlessInterruptedBy":""}]
  },
  "continuityFirewall": {
    "establishedFacts":[],"antiRetconAnchors":[],"offscreenState":[],
    "pendingConsequences":[{"cause":"","pending":"","urgency":5,"status":"PENDING"}],
    "bannedNext":[{"text":"","reason":"","scope":"turn","source":"compiler"}],
    "impossibleNext":[],
    "risks":[{"severity":"medium","issue":"","evidence":"","recommendation":""}],
    "terms":[{"party":"","term":"","status":"UNKNOWN","binding":false}]
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
      "negative":"","intent":"","composition":"","camera":"",
      "lighting":"","colorPalette":"","environment":"",
      "characterContinuity":"","action":"","materials":"","mood":"",
      "textRendering":"","constraints":[],"full":"","hint":""
    }
  },
  "auditLog": [{
    "system":"compiler","marker":"","result":"","repaired":false,"notes":""
  }]
}

For disabled optional modules: meters=[], scene=null, worldState=null, the
corresponding tools member=null, and auditLog=[]. Empty optional arrays inside an
enabled object are valid. Do not emit example rows when there is no evidence.`;
function buildStockModulePromptBlock(key, overrides = {}) {
  const module = getEffectiveModuleCatalog({ stockModuleOverrides: overrides }).find((candidate) => candidate.key === key);
  if (!module) return "";
  return [
    `- ${module.key} (${module.label}): ${module.compilerInstruction}`,
    `  Schema: ${module.schemaSummary}`
  ].join("\n");
}
function buildStateCompilerPrompt(enabledModules, customModules = [], overrides = {}) {
  const enabled = getEffectiveModuleCatalog({ stockModuleOverrides: overrides }).filter((module) => enabledModules.includes(module.key)).map((module) => {
    return buildStockModulePromptBlock(module.key, overrides);
  }).join("\n");
  const enabledCustom = customModules.filter((m) => m.enabled).map((m) => {
    const fields = Object.fromEntries(m.schemaFields.map((field) => {
      if (field.type === "number") return [field.key, field.defaultValue ?? field.min ?? 0];
      if (field.type === "boolean") return [field.key, field.defaultValue ?? false];
      if (field.type === "enum") return [field.key, field.defaultValue ?? field.enumOptions[0] ?? ""];
      if (field.type === "gauge") {
        return [field.key, {
          value: field.defaultValue ?? field.min ?? 0,
          pct: "0%",
          band: "unknown",
          color: "var(--loomos-muted)",
          trend: "unknown",
          note: ""
        }];
      }
      if (field.type === "chips" || field.type === "list") return [field.key, []];
      return [field.key, field.defaultValue ?? ""];
    }));
    return [
      `- customModuleData[moduleId=${m.id}] (${m.label}): ${m.compilerInstruction}`,
      `  maxItems=${m.maxItems}; outputMode=${m.outputMode}; fields=${JSON.stringify(fields)}`,
      "  Output data only. Never output HTML, CSS, scripts, or template markup."
    ].join("\n");
  }).join("\n");
  const trackingText = enabled + (enabledCustom ? "\n\nEnabled custom tracking modules:\n" + enabledCustom : "");
  let customContract = "";
  let customShape = "";
  if (customModules.some((m) => m.enabled)) {
    customContract = `
- customModuleData: Array of compiled custom modules. For each enabled custom module, append an entry with the exact moduleId, label, a turn summary, a fields object using only its declared schema field keys, and an items array (up to its maxItems limit) containing title, text, importance (low/medium/high/critical), and optional color.`;
    customShape = `,
  "customModuleData": [
    {
      "moduleId": "custom_module_id",
      "label": "Custom Module Label",
      "summary": "Turn summary",
      "fields": {},
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
  const appearanceRules = enabledModules.includes("appearance") ? `
- For each named adult character, populate grounded appearance fields when transcript or seed evidence exists.
- Treat appearance as persistent identity state. Carry it forward unchanged unless the transcript explicitly changes it.
- Write fullDescription as a coherent 3-6 sentence visual portrait, not a terse keyword list. Write anchor as a concise identity lock for future turns.
- Describe hair color, length, texture and styling; eye color, shape and expression; facial structure and features; complexion and skin details; height and weight impression; frame, build, musculature or softness; shoulders, chest or bust, waist, hips, glute or seat shape, limbs, hands, posture, movement, voice, marks, scars, tattoos, piercings, attractive features, and unique identifiers when evidence supports them.
- Never infer exact measurements, cup sizes, numeric weight, hidden anatomy, or unsupported sexual details. Only populate bust, glutes, and attractiveFeatures for confirmed or assumed adults. Keep any minor or age-ambiguous description neutral.
- Use empty strings and arrays for unknown appearance fields. Never reset established appearance each turn.` : `
- Appearance tracking is disabled. Preserve an empty appearance object and do not invent new physical traits.`;
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
- Keep character tracking non-explicit. When age is unspecified, treat characters as adults and never output minors.
- Do not reveal hidden chain-of-thought. Secrets are reader-visible dramatic state only.
- activeModules must contain only enabled module keys.
- For custom modules, output structured data only. The user-authored renderer owns HTML and CSS.
- Respect each custom schema field key, type, enum options, required flag, numeric range, and maxItems.
- Empty schema defaults are valid when the transcript has no evidence.
- Use numeric ranges exactly as named: percentages 0-100, threat/observer pressure 0-10, urgency 0-5, conflict severity 1-3.

Character depth rules:
${appearanceRules}
- Clothing persists until transcript explicitly shows change. Write clothing.summary as a coherent 2-4 sentence outfit description and separately track up to 8 visible layers (outer/upper/lower/feet/accessory/other).
- For clothing, include garment type, cut, color, pattern, material, texture, fit, coverage, closures, condition, wear, wetness, damage, stains, accessories, footwear, and how the outfit sits on or moves with the body when evidence supports it.
- Mark clothing.changed=true when clothing updates, including when a garment is added, removed, opened, shifted, damaged, wet, stained, or transferred.
- Update currentState (pose, proximity, leftHand, rightHand, emotion, intent, physicalTell, injury) from latest transcript actions and descriptions.
- Relationships: use axis labels (Trust, Fear, Attraction, Rivalry, Loyalty, Debt). Value -100 (hostile) to 100 (devoted). Include evidence for changes.
- Spot trends (up/down/steady) on relationship values.
- Set changed=true and add changeNote whenever a character's location, clothing, inventory, pose, emotional state, awareness, relationship, or intent changes from the previous turn.
- Uncertainty: log claims that are not yet fully confirmed with confidence 0-10 and appropriate label.
- Crowd/background groups: summarize compactly with qty. Do not over-individualize.
- Never output explicit anatomical details. Focus on grounded, useful continuity.
- When age is unspecified, assume adult. Never output minors.
- Spotlight queue: track turnsSince each named character last had narrative focus. Use need: active/soon/okay/quiet/background.
- Character-level castMatrix[].goals are always compact strings. Structured goals with who/goal/status/note fields belong only in storyState.goals.

GPT Image prompt rules:
- When imagePrompt is enabled, build a production-ready visual brief from the exact tracker state rather than a short tag list.
- Follow this order inside tools.imagePrompt.full: INTENT; SCENE AND ENVIRONMENT; SUBJECTS AND CONTINUITY; ACTION AND POSE; COMPOSITION; CAMERA; LIGHTING AND COLOR; MATERIALS AND TEXTURE; MEDIUM AND FINISH; TEXT; CONSTRAINTS.
- Use short labeled sections or line breaks. Use concrete natural language and avoid repetitive quality buzzwords or keyword stuffing.
- Preserve each character's established appearance, clothing, body proportions, marks, visible accessories, pose, gaze, hands, and object interactions. Do not contradict appearance or clothing modules.
- Specify subject scale and body framing, whether feet must be visible, gaze direction, hand placement, foreground/midground/background placement, camera angle, viewpoint, perspective, atmosphere, and negative space when relevant.
- For photorealistic output, say photorealistic, real photograph, professional photography, or an equivalent direct cue. Treat lens and camera details as high-level visual guidance rather than exact physical simulation.
- State explicit invariants and exclusions: no watermark, no unintended text, no logos or trademarks, no extra people or limbs, no malformed hands, no cropped required body parts, and no continuity drift unless requested.
- If text should appear, put the exact text and placement in textRendering. Otherwise use "No text in the image."
- Use a detailed 350-800 word full prompt when the tracker contains enough visual evidence. Prefer specificity over filler; do not invent missing scene or character facts.
`;
}
var STATE_REPAIR_PROMPT = `Repair a malformed LoomOS State V2 compiler result.
Return exactly one corrected JSON object and no Markdown or explanation.
Keep only supported fields, satisfy all required core objects, obey array
limits, and use null or empty arrays for disabled modules.
Do not add new story events or unsupported facts.

SHAPE CORRECTIONS (fix these common mistakes):
- castMatrix[].goals MUST be string[], not objects. If you wrote an object like {"goal":"Find X"}, extract "Find X" as a string in the array.
- castMatrix[].pockets MUST be object[] with {name, type, qty, condition, known}. If you wrote a plain string, wrap it in {name: string, type:"misc", qty:1, condition:"", known:true}.
- castMatrix[].stableFacts MUST be string[], not objects. Extract text from objects.
- castMatrix[].leverage MUST be string[], not objects. Extract text from objects.
- continuityFirewall.impossibleNext MUST be string[], not objects. Extract text from objects.
- continuityFirewall.establishedFacts MUST be string[], not objects.
- continuityFirewall.antiRetconAnchors MUST be string[], not objects.
- continuityFirewall.offscreenState MUST be string[], not objects.
- continuityFirewall.pendingConsequences MUST be object[] with {cause, pending, urgency, status}.
- continuityFirewall.bannedNext MUST be object[] with {text, reason, scope, source}.
- continuityFirewall.terms MUST be object[] with {party, term, status, binding}.
- kernel.constraints MUST be string[], not objects.
- scene.spatial MUST be string[], not objects.
- scene.access.items MUST be string[], not objects.
- scene.access.people MUST be string[], not objects.
- storyState.threadLoom[].participants MUST be string[], not objects.

EXAMPLES:
- BAD: "goals": [{"goal": "Find the baths"}]
  GOOD: "goals": ["Find the baths"]
- BAD: "pockets": ["Lock pick"]
  GOOD: "pockets": [{"name": "Lock pick", "type": "tool", "qty": 1, "condition": "Good", "known": true}]
- BAD: "impossibleNext": [{"text": "Using the east stair"}]
  GOOD: "impossibleNext": ["Using the east stair"]
- BAD: "pendingConsequences": ["The guards are approaching"]
  GOOD: "pendingConsequences": [{"cause": "Guards patrol", "pending": "The guards are approaching", "urgency": 5, "status": "PENDING"}]
- BAD: "relationships": ["Iven: Trust=30"]
  GOOD: "relationships": [{"target": "Iven", "axis": "Trust", "value": 30}]
`;

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
function rawValidationIssues(raw) {
  try {
    const parsed = extractJsonObject(raw);
    const result = LoomOSCompiledStateSchema.safeParse(parsed);
    if (result.success) return [];
    return result.error.issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`);
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
}
function parseCompilerOutputDetailed(raw, request, repaired) {
  const normalized = normalizeCompiledState(extractJsonObject(raw), {
    enabledModules: request.enabledModules,
    customModules: request.customModules
  });
  const state = LoomOSStateSchema.parse({
    ...normalized.state,
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
  return { state, report: normalized.report };
}
function normalizeFailureIssues(error, raw) {
  if (error instanceof CompiledStateNormalizationError) return error.report.issues;
  const rawIssues = rawValidationIssues(raw);
  return rawIssues.length > 0 ? rawIssues : [error instanceof Error ? error.message : String(error)];
}
function debugReport(firstIssues, repairIssues, fallbackSaved) {
  return [
    "LoomOS compiler debug report",
    "Normalization attempted: yes",
    `Fallback saved: ${fallbackSaved ? "yes" : "no"}`,
    "",
    "First output issues:",
    ...firstIssues.length > 0 ? firstIssues : ["none"],
    "",
    "Repair output issues:",
    ...repairIssues.length > 0 ? repairIssues : ["none"]
  ].join("\n");
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
    {
      role: "system",
      content: buildStateCompilerPrompt(
        request.enabledModules,
        request.customModules,
        request.stockModuleOverrides
      )
    },
    { role: "user", content: compilerUserMessage(request) }
  ];
  request.onPhase?.("requesting", 1, "Requesting structured state from the selected connection.");
  const firstRaw = await request.generate(firstMessages, request.signal, 1);
  request.onPhase?.("validating", 1, "Normalizing and validating State V2 output.");
  let firstIssues = [];
  try {
    const parsed = parseCompilerOutputDetailed(firstRaw, request, false);
    return {
      ok: true,
      state: parsed.state,
      repaired: false,
      normalized: parsed.report.normalized,
      fallbackSaved: false,
      issues: [],
      debugReport: debugReport([], [], false)
    };
  } catch (error) {
    firstIssues = normalizeFailureIssues(error, firstRaw);
    request.onPhase?.(
      "repairing",
      2,
      `Output remained invalid after normalization; repairing ${firstIssues[0] ?? "schema mismatch"}.`
    );
    const repairMessages = [
      {
        role: "system",
        content: `${STATE_REPAIR_PROMPT}

${buildStateCompilerPrompt(
          request.enabledModules,
          request.customModules,
          request.stockModuleOverrides
        )}`
      },
      {
        role: "user",
        content: [
          "Enabled modules:",
          request.enabledModules.join(", "),
          "",
          "Validation failures:",
          firstIssues.slice(0, 8).join("\n"),
          "",
          "Malformed output:",
          firstRaw.slice(0, 36e3)
        ].join("\n")
      }
    ];
    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    request.onPhase?.("validating", 2, "Normalizing and validating repaired State V2 output.");
    try {
      const parsed = parseCompilerOutputDetailed(repairedRaw, request, true);
      return {
        ok: true,
        state: parsed.state,
        repaired: true,
        normalized: parsed.report.normalized,
        fallbackSaved: false,
        issues: firstIssues.slice(0, 8),
        debugReport: debugReport(firstIssues, [], false)
      };
    } catch (error2) {
      const repairIssues = normalizeFailureIssues(error2, repairedRaw);
      const issues = [...firstIssues, ...repairIssues].slice(0, 8);
      const fallbackCompiled = buildFallbackCompiledState({
        enabledModules: request.enabledModules,
        seedState: request.seedState ?? request.existingState,
        transcript: request.transcript,
        notes: issues.join(" | ")
      });
      const state = LoomOSStateSchema.parse({
        ...fallbackCompiled,
        schemaVersion: 2,
        identity: request.identity,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        source: {
          messageCount: request.messageCount,
          repaired: true,
          seedIdentity: request.seedState?.identity ?? null,
          connectionId: request.connectionId
        }
      });
      return {
        ok: true,
        state,
        repaired: true,
        normalized: true,
        fallbackSaved: true,
        issues,
        debugReport: debugReport(firstIssues, repairIssues, true)
      };
    }
  }
}

// src/backend/generation.ts
function isRecord2(value) {
  return typeof value === "object" && value !== null;
}
function normalizeGenerationText(result) {
  if (typeof result === "string" && result.trim()) return result;
  if (!isRecord2(result)) {
    throw new Error("Lumiverse generation returned an unsupported response.");
  }
  for (const key of ["content", "text", "output", "response"]) {
    const value = result[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  const message = result.message;
  if (typeof message === "string" && message.trim()) return message;
  if (isRecord2(message) && typeof message.content === "string" && message.content.trim()) {
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
function memberInjection(member, hasAppearance, hasVisuals, hasClothing) {
  let text2 = `cast.${xmlEscape(member.name, 80)}: ${xmlEscape(member.status)}; intent=${xmlEscape(member.intent)}; goal=${xmlEscape(member.goals[0] ?? "")}`;
  if (hasAppearance) {
    const appearance = member.appearance;
    const anchor = appearance?.anchor || appearance?.fullDescription || [
      appearance?.height,
      appearance?.bodyType || appearance?.build,
      appearance?.hair,
      appearance?.eyes,
      appearance?.uniqueFeatures || appearance?.distinguishingMarks
    ].filter(Boolean).join(", ");
    if (anchor) text2 += `; appearance=${xmlEscape(anchor, 220)}`;
  }
  if (hasVisuals) {
    text2 += `; pose=${xmlEscape(member.currentState?.pose ?? member.pose ?? "")}; emotion=${xmlEscape(member.currentState?.emotion ?? member.emotionalState ?? "")}`;
  }
  if (hasClothing && member.clothing?.summary) {
    text2 += `; attire=${xmlEscape(member.clothing.summary)}`;
  }
  if (member.changed) {
    text2 += ` [changed]`;
  }
  return text2;
}
async function buildCompactInjection(state, settings, countTokens, overrides) {
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
      (item) => `pending: ${xmlEscape(typeof item === "string" ? item : item.pending)}`
    ));
  }
  if (enabled("actionResolver") && state.tools.actionResolver) {
    const resolver = state.tools.actionResolver;
    fragments.push(
      `action: ${xmlEscape(resolver.userAction)}; response=${xmlEscape(resolver.worldResponse)}; risk=${xmlEscape(resolver.risk)}`
    );
  }
  if (enabled("castCore")) {
    const hasAppearance = enabled("appearance");
    const hasVisuals = enabled("castVisuals") || enabled("imagePrompt");
    const hasClothing = enabled("clothing");
    fragments.push(...state.castMatrix.filter((member) => member.kind === "pov" || member.kind === "main" || member.spotlight.value >= 45).slice(0, 6).map((member) => memberInjection(member, hasAppearance, hasVisuals, hasClothing)));
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
    fragments.push(...state.continuityFirewall.bannedNext.filter((item) => item.scope === "persistent" || item.scope === "scene").slice(0, 4).map((item) => `avoid: ${xmlEscape(item.text)}${item.reason ? ` (${xmlEscape(item.reason)})` : ""}`));
  }
  const enabledCustomMods = settings.customModules || [];
  for (const cm of enabledCustomMods) {
    if (cm.enabled && cm.inject) {
      const compiled = state.customModuleData?.find((m) => m.moduleId === cm.id);
      if (compiled && (compiled.items.length > 0 || Object.keys(compiled.fields).length > 0)) {
        const fieldSummary = Object.entries(compiled.fields).slice(0, 4).map(([key, value]) => `${key}=${typeof value === "object" ? JSON.stringify(value) : String(value)}`).join("; ");
        fragments.push(
          `cmod.${xmlEscape(cm.label, 80)}: ${xmlEscape(compiled.summary)}`,
          ...fieldSummary ? [`fields.${xmlEscape(cm.label, 60)}: ${xmlEscape(fieldSummary)}`] : [],
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
      relationships: member.relationships.slice(0, 6).map((rel) => ({ target: rel, axis: "general", value: 0 })),
      leverage: member.leverage.slice(0, 6),
      pockets: [],
      stableFacts: [],
      changed: false
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
      pendingConsequences: state.continuityFirewall.pendingConsequences.slice(0, 30).map((c) => ({
        cause: c.slice(0, 500),
        pending: c.slice(0, 1600)
      })),
      offscreenState: [],
      bannedNext: [],
      impossibleNext: [],
      risks: state.continuityFirewall.risks,
      terms: []
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
function hasAppearanceEvidence(appearance) {
  return Object.values(appearance ?? {}).some(
    (value) => Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
}
function trimJsonToBudget(value, tokenBudget) {
  const serialized = JSON.stringify(value);
  const maxChars = Math.max(800, tokenBudget * 4);
  if (serialized.length <= maxChars) return serialized;
  let low = 0;
  let high = serialized.length;
  let result = JSON.stringify({ snapshotExcerpt: "", truncated: true });
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = JSON.stringify({
      snapshotExcerpt: serialized.slice(0, middle),
      truncated: true
    });
    if (candidate.length <= maxChars) {
      result = candidate;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return result;
}
function buildStateSeedForCompiler(state, settings) {
  const modules = settings.moduleSettings;
  const expandedSeed = settings.compilerSeedTokenBudget >= 1800;
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
      appearance: modules.appearance.track && hasAppearanceEvidence(member.appearance) ? {
        ageBand: member.appearance.ageBand,
        bodyType: member.appearance.bodyType,
        proportions: member.appearance.proportions,
        glutes: member.appearance.glutes,
        hair: member.appearance.hair,
        eyes: member.appearance.eyes,
        uniqueFeatures: member.appearance.uniqueFeatures,
        attractiveFeatures: member.appearance.attractiveFeatures,
        immutableTraits: member.appearance.immutableTraits?.slice(0, 8),
        anchor: member.appearance.anchor,
        ...expandedSeed ? {
          species: member.appearance.species,
          apparentAge: member.appearance.apparentAge,
          genderPresentation: member.appearance.genderPresentation,
          height: member.appearance.height,
          weight: member.appearance.weight,
          build: member.appearance.build,
          frame: member.appearance.frame,
          silhouette: member.appearance.silhouette,
          shoulders: member.appearance.shoulders,
          bust: member.appearance.bust,
          waist: member.appearance.waist,
          hips: member.appearance.hips,
          skin: member.appearance.skin,
          complexion: member.appearance.complexion,
          face: member.appearance.face,
          facialStructure: member.appearance.facialStructure,
          distinguishingMarks: member.appearance.distinguishingMarks,
          scars: member.appearance.scars,
          tattoos: member.appearance.tattoos,
          piercings: member.appearance.piercings,
          presence: member.appearance.presence,
          fullDescription: member.appearance.fullDescription
        } : {}
      } : void 0,
      clothing: modules.clothing.track ? {
        summary: compactText(member.clothing?.summary ?? member.clothingSummary ?? "", expandedSeed ? 600 : 170),
        layerCount: member.clothing?.layerCount ?? 0,
        layers: member.clothing?.layers.slice(0, expandedSeed ? 8 : 4).map((layer) => ({
          slot: layer.slot,
          text: compactText(layer.text, expandedSeed ? 360 : 140),
          state: compactText(layer.state ?? "", expandedSeed ? 240 : 80),
          color: layer.color
        })),
        ...expandedSeed ? {
          condition: compactText(member.clothing?.condition ?? "", 420),
          footwear: compactText(member.clothing?.footwear ?? "", 420),
          accessories: compactText(member.clothing?.accessories ?? "", 420),
          notable: compactText(member.clothing?.notable ?? "", 420),
          silhouette: compactText(member.clothing?.silhouette ?? ""),
          palette: compactText(member.clothing?.palette ?? ""),
          fabric: compactText(member.clothing?.fabric ?? "", 420),
          fit: compactText(member.clothing?.fit ?? "", 420),
          styling: compactText(member.clothing?.styling ?? "", 420),
          coverage: compactText(member.clothing?.coverage ?? "", 420)
        } : {}
      } : void 0,
      currentState: modules.castVisuals.track && member.currentState ? {
        pose: compactText(member.currentState.pose ?? member.pose ?? ""),
        proximity: compactText(member.currentState.proximity ?? member.proximity ?? ""),
        hands: compactText(member.currentState.leftHand ?? member.hands ?? ""),
        emotion: compactText(member.currentState.emotion ?? member.emotionalState ?? ""),
        injury: compactText(member.currentState.injury ?? "")
      } : void 0,
      changed: member.changed,
      goals: member.goals.slice(0, 4).map(compactText),
      relationships: modules.relationships.track ? member.relationships.slice(0, 4).map((rel) => ({
        target: rel.target,
        value: rel.value,
        trend: rel.trend,
        evidence: rel.evidence ? compactText(rel.evidence) : void 0
      })) : void 0,
      pockets: modules.inventory.track ? member.pockets.slice(0, 4).map((item) => ({
        name: item.name,
        qty: item.qty,
        condition: compactText(item.condition),
        known: item.known
      })) : void 0,
      stableFacts: member.stableFacts.slice(0, 4).map(compactText),
      uncertainty: member.continuity?.uncertainty?.slice(0, 3).map((u) => ({
        claim: compactText(u.claim),
        confidence: u.confidence,
        label: u.label
      }))
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
      pending: state.continuityFirewall.pendingConsequences.slice(0, 10).map(
        (item) => compactText(typeof item === "string" ? item : item.pending)
      ),
      offscreen: state.continuityFirewall.offscreenState.slice(0, 8).map(compactText),
      persistentBans: state.continuityFirewall.bannedNext.filter((item) => item.scope === "persistent").slice(0, 6).map((item) => compactText(item.text)),
      terms: state.continuityFirewall.terms?.slice(0, 6).map((item) => ({
        party: item.party,
        term: compactText(item.term),
        status: item.status
      }))
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
function resolveStorageListPath(prefix, listedPath) {
  const normalizedPrefix = prefix.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const normalizedPath = listedPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`) || normalizedPath.startsWith("chats/")) {
    return normalizedPath;
  }
  return `${normalizedPrefix}/${normalizedPath}`;
}
function parseChatStateStoragePath(listedPath, chatId) {
  const prefix = `chats/${encodeStorageSegment(chatId)}/messages`;
  const fullPath = resolveStorageListPath(prefix, listedPath);
  const parts = fullPath.split("/");
  if (parts.length !== 6 || parts[0] !== "chats" || parts[1] !== encodeStorageSegment(chatId) || parts[2] !== "messages" || parts[4] !== "swipes") {
    return null;
  }
  const swipeMatch = /^(\d+)\.json$/.exec(parts[5] ?? "");
  if (!swipeMatch) return null;
  try {
    const messageId = decodeURIComponent(parts[3] ?? "");
    if (!messageId) return null;
    return { messageId, swipeId: Number(swipeMatch[1]) };
  } catch {
    return null;
  }
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
var automaticGenerationKeys = /* @__PURE__ */ new Set();
var interceptorRegistered = false;
var interceptorEnabled = spindle.permissions.has("interceptor");
var disposed = false;
function isRecord3(value) {
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
    if (!isRecord3(raw) || raw.schemaVersion !== 2) {
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
  const activeChatId = activeChatByUser.get(userId);
  if (activeChatId) {
    await trimStateHistory(activeChatId, userId, parsed.historyRetentionLimit);
  }
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
  if (isRecord3(raw) && raw.schemaVersion === 1) {
    await spindle.userStorage.setJson(path, state, { indent: 2, userId });
  }
  return state;
}
async function persistState(state, userId, historyRetentionLimit) {
  const parsed = LoomOSStateSchema.parse(state);
  await spindle.userStorage.setJson(stateStoragePath(parsed.identity), parsed, {
    indent: 2,
    userId
  });
  const limit = historyRetentionLimit ?? (await getSettings(userId)).historyRetentionLimit;
  await trimStateHistory(parsed.identity.chatId, userId, limit, parsed.identity);
  return parsed;
}
async function deleteState(identity, userId) {
  const path = stateStoragePath(identity);
  if (await spindle.userStorage.exists(path, userId)) {
    await spindle.userStorage.delete(path, userId);
  }
}
async function invalidateMessageStates(chatId, messageId, userId) {
  const prefix = messageStatePrefix(chatId, messageId);
  const paths = await spindle.userStorage.list(prefix, userId);
  await Promise.all(paths.map(
    (path) => spindle.userStorage.delete(resolveStorageListPath(prefix, path), userId)
  ));
}
async function listChatStates(chatId, userId) {
  const prefix = `chats/${encodeStorageSegment(chatId)}/messages`;
  try {
    const files = await spindle.userStorage.list(prefix, userId);
    const results = [];
    for (const file of files) {
      const parsed = parseChatStateStoragePath(file, chatId);
      if (parsed) results.push(parsed);
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
async function trimStateHistory(chatId, userId, limit, protectedIdentity) {
  let history = await buildStateHistory(chatId, userId);
  if (protectedIdentity) {
    const protectedPath = stateStoragePath(protectedIdentity);
    const protectedItem = history.find((item) => stateStoragePath(item.identity) === protectedPath);
    if (protectedItem) {
      history = [
        protectedItem,
        ...history.filter((item) => stateStoragePath(item.identity) !== protectedPath)
      ];
    }
  }
  const excess = history.slice(limit);
  if (excess.length === 0) return;
  await Promise.all(excess.map((item) => deleteState(item.identity, userId)));
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
    const compact = await buildCompactInjection(state, settings, async (text2) => {
      try {
        return (await spindle.tokens.countText(text2, { userId })).total_tokens;
      } catch {
        return Math.ceil(text2.length / 4);
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
      stockModuleOverrides: settings.stockModuleOverrides,
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
    const state = await persistState(
      compiled.state,
      userId,
      settings.historyRetentionLimit
    );
    send({ type: "state", requestId, identity, state }, userId);
    send({
      type: "generation_status",
      requestId,
      status: "completed",
      identity,
      message: compiled.fallbackSaved ? "Compiler output stayed invalid; a minimal valid fallback state was saved." : compiled.repaired ? "State compiled after one repair pass." : compiled.normalized ? "State normalized, validated, and saved." : "State compiled and saved.",
      report: {
        phase: "saving",
        attempt: compiled.repaired ? 2 : 1,
        elapsedMs: Date.now() - startedAt,
        connectionId: connection.id,
        message: compiled.fallbackSaved ? "Minimal fallback state saved." : "Validated state saved.",
        normalized: compiled.normalized,
        fallbackSaved: compiled.fallbackSaved,
        issues: compiled.issues.slice(0, 8),
        debugReport: compiled.debugReport
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
  if (!isRecord3(payload) || typeof payload.type !== "string") {
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
      case "load_history_state": {
        const identity = StateIdentitySchema.parse(request.identity);
        rememberUserChat(userId, identity.chatId);
        send({
          type: "state",
          requestId,
          identity,
          state: await loadState(identity, userId)
        }, userId);
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
      case "delete_history_state": {
        const identity = StateIdentitySchema.parse(request.identity);
        await deleteState(identity, userId);
        send({
          type: "history_state_deleted",
          requestId,
          chatId: identity.chatId,
          identity,
          items: await buildStateHistory(identity.chatId, userId)
        }, userId);
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
  if (!isRecord3(payload)) return null;
  const message = isRecord3(payload.message) ? payload.message : payload;
  if (typeof message.id !== "string" || typeof message.chat_id !== "string" || typeof message.swipe_id !== "number" || !Array.isArray(message.swipes)) return null;
  return message;
}
async function queueAutomaticGeneration(identity, userId) {
  const key = identityJobKey(userId, identity);
  if (automaticGenerationKeys.has(key)) return;
  automaticGenerationKeys.add(key);
  try {
    await generateState(
      `auto:${identity.messageId}:${identity.swipeId}:${Date.now()}`,
      identity,
      userId
    );
  } finally {
    automaticGenerationKeys.delete(key);
  }
}
async function handleAutomaticMessage(message, eventUserId) {
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
      void queueAutomaticGeneration(identity, userId).catch((error) => {
        spindle.log.warn(`LoomOS automatic generation skipped: ${errorMessage(error)}`);
      });
    }
  }
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
  if (!isRecord3(payload) || typeof payload.chatId !== "string" || typeof payload.messageId !== "string") return;
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    await invalidateMessageStates(payload.chatId, payload.messageId, userId);
  }
}
async function handleMessageSent(payload, eventUserId) {
  const message = eventMessage(payload);
  if (!message) return;
  await handleAutomaticMessage(message, eventUserId);
}
async function handleGenerationEnded(payload, eventUserId) {
  if (payload.error || !payload.messageId) return;
  let message;
  for (const delay of [0, 75, 200]) {
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      message = (await getMessages(payload.chatId)).find((candidate) => candidate.id === payload.messageId);
    } catch (error) {
      spindle.log.warn(`LoomOS could not resolve completed generation: ${errorMessage(error)}`);
      return;
    }
    if (message) break;
  }
  if (!message) {
    spindle.log.warn(`LoomOS could not find saved generated message ${payload.messageId}.`);
    return;
  }
  await handleAutomaticMessage(message, eventUserId);
}
function tryRegisterInterceptor() {
  if (interceptorRegistered || !spindle.permissions.has("interceptor")) return;
  interceptorRegistered = true;
  interceptorEnabled = true;
  spindle.registerInterceptor(async (messages, context) => {
    if (!interceptorEnabled || disposed || !isRecord3(context)) return messages;
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
      const compact = await buildCompactInjection(state, settings, async (text2) => {
        try {
          return (await spindle.tokens.countText(text2, { userId })).total_tokens;
        } catch {
          return Math.ceil(text2.length / 4);
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
  automaticGenerationKeys.clear();
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
disposers.push(spindle.on("GENERATION_ENDED", (payload, userId) => {
  void handleGenerationEnded(payload, userId);
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
  if (isRecord3(payload) && payload.extensionId === EXTENSION_ID) disposeBackend();
}));
tryRegisterInterceptor();
spindle.log.info("LoomOS Command Deck backend loaded.");
export {
  disposeBackend
};
