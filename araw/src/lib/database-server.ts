/**
 * ARAW V3.0 Dashboard - MySQL Database Connection (SERVER ONLY)
 * 
 * This file should only be imported in server-side code (API routes, Server Components)
 * Uses 'server-only' to prevent accidental client-side imports
 */

import 'server-only';
import mysql from 'mysql2/promise';

export * from './database';

