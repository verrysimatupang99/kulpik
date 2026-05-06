import { NextResponse } from 'next/server';

export type ApiSuccess<T = unknown> = {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      details?: unknown;
    } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 500;
    this.code = options.code ?? 'INTERNAL_ERROR';
    this.details = options.details;
  }
}

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';

  return value
    .replace(/[<>;&#|\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function parseInteger(
  value: unknown,
  options: {
    defaultValue: number;
    min?: number;
    max?: number;
  },
): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isFinite(parsed)) return options.defaultValue;

  let result = Math.trunc(parsed);

  if (typeof options.min === 'number') {
    result = Math.max(options.min, result);
  }

  if (typeof options.max === 'number') {
    result = Math.min(options.max, result);
  }

  return result;
}

export function parseBudgetRange(input: {
  budget_min?: unknown;
  budget_max?: unknown;
  budgetMin?: unknown;
  budgetMax?: unknown;
}): {
  budgetMin: number;
  budgetMax: number;
} {
  const budgetMin = parseInteger(input.budget_min ?? input.budgetMin, {
    defaultValue: 0,
    min: 0,
    max: 500_000_000,
  });

  const budgetMax = parseInteger(input.budget_max ?? input.budgetMax, {
    defaultValue: 100_000_000,
    min: 0,
    max: 500_000_000,
  });

  if (budgetMin > budgetMax) {
    throw new ApiError(
      'Budget minimum tidak boleh lebih besar dari budget maksimum.',
      {
        status: 400,
        code: 'INVALID_BUDGET_RANGE',
        details: { budgetMin, budgetMax },
      },
    );
  }

  return { budgetMin, budgetMax };
}

export function parsePagination(input: {
  limit?: unknown;
  offset?: unknown;
  page?: unknown;
}): {
  limit: number;
  offset: number;
  page: number;
} {
  const limit = parseInteger(input.limit, {
    defaultValue: DEFAULT_LIMIT,
    min: 1,
    max: MAX_LIMIT,
  });

  const page = parseInteger(input.page, {
    defaultValue: 1,
    min: 1,
    max: 10_000,
  });

  const explicitOffset =
    input.offset === undefined || input.offset === null
      ? undefined
      : parseInteger(input.offset, {
          defaultValue: 0,
          min: 0,
          max: 1_000_000,
        });

  const offset = explicitOffset ?? (page - 1) * limit;

  return { limit, offset, page };
}

export function requireString(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
  } = {},
): string {
  const sanitized = sanitizeText(value, options.maxLength ?? 500);

  if (sanitized.length < (options.minLength ?? 1)) {
    throw new ApiError(`${fieldName} wajib diisi.`, {
      status: 400,
      code: 'VALIDATION_ERROR',
      details: { field: fieldName },
    });
  }

  return sanitized;
}

export function requireStringArray(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    itemMaxLength?: number;
  } = {},
): string[] {
  if (!Array.isArray(value)) {
    throw new ApiError(`${fieldName} harus berupa array.`, {
      status: 400,
      code: 'VALIDATION_ERROR',
      details: { field: fieldName },
    });
  }

  const items = value
    .map((item) => sanitizeText(item, options.itemMaxLength ?? 120))
    .filter(Boolean);

  if (items.length < (options.minLength ?? 0)) {
    throw new ApiError(`${fieldName} belum memenuhi jumlah minimum.`, {
      status: 400,
      code: 'VALIDATION_ERROR',
      details: { field: fieldName, minLength: options.minLength ?? 0 },
    });
  }

  if (
    typeof options.maxLength === 'number' &&
    items.length > options.maxLength
  ) {
    throw new ApiError(`${fieldName} melebihi jumlah maksimum.`, {
      status: 400,
      code: 'VALIDATION_ERROR',
      details: { field: fieldName, maxLength: options.maxLength },
    });
  }

  return items;
}

export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  options: {
    status?: number;
    message?: string;
    meta?: Record<string, unknown>;
    headers?: HeadersInit;
    legacyFields?: boolean;
  } = {},
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options.legacyFields ? data : {}),
      ...(options.message ? { message: options.message } : {}),
      ...(options.meta ? { meta: options.meta } : {}),
    },
    {
      status: options.status ?? 200,
      headers: options.headers,
    },
  );
}

export function jsonError(
  error: unknown,
  options: {
    fallbackMessage?: string;
    fallbackCode?: string;
    status?: number;
    meta?: Record<string, unknown>;
    headers?: HeadersInit;
  } = {},
): NextResponse<ApiFailure> {
  const isProduction = process.env.NODE_ENV === 'production';

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(!isProduction && error.details !== undefined
            ? { details: error.details }
            : {}),
        },
        ...(options.meta ? { meta: options.meta } : {}),
      },
      {
        status: options.status ?? error.status,
        headers: options.headers,
      },
    );
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : (options.fallbackMessage ?? 'Terjadi kesalahan pada server.');

  return NextResponse.json(
    {
      success: false,
      error: {
        code: options.fallbackCode ?? 'INTERNAL_ERROR',
        message: isProduction
          ? (options.fallbackMessage ?? 'Terjadi kesalahan pada server.')
          : message,
        ...(!isProduction ? { details: error } : {}),
      },
      ...(options.meta ? { meta: options.meta } : {}),
    },
    {
      status: options.status ?? 500,
      headers: options.headers,
    },
  );
}

export function withCache(
  seconds: number,
  staleWhileRevalidate = seconds * 2,
): HeadersInit {
  return {
    'Cache-Control': `public, s-maxage=${seconds}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

export function noStore(): HeadersInit {
  return {
    'Cache-Control': 'no-store',
  };
}

export async function readJsonBody<T = Record<string, unknown>>(
  request: Request,
): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError('Body request harus berupa JSON valid.', {
      status: 400,
      code: 'INVALID_JSON',
    });
  }
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new ApiError(
      `Server belum dikonfigurasi dengan benar: ${name} belum tersedia.`,
      {
        status: 500,
        code: 'MISSING_ENV',
        details: { env: name },
      },
    );
  }

  return value;
}
