import { NextResponse } from 'next/server';

export const ok = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json({ data, success: true }, { status: 200, ...init });

export const created = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json({ data, success: true }, { status: 201, ...init });

export const badRequest = (message: string, init?: ResponseInit) =>
  NextResponse.json({ error: message, success: false }, { status: 400, ...init });

export const unauthorized = (message = 'Unauthorized', init?: ResponseInit) =>
  NextResponse.json({ error: message, success: false }, { status: 401, ...init });

export const serverError = (message = 'Server error', init?: ResponseInit) =>
  NextResponse.json({ error: message, success: false }, { status: 500, ...init });
