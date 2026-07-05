import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { getClient, query } from '../db/index.js';

export async function getBalance(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;

  try {
    const result = await query(
      'SELECT balance FROM users WHERE email = $1',
      [email],
      'get-user-balance'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    const balance = parseInt(result.rows[0].balance, 10);

    return res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: balance,
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function topUp(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;
  const { top_up_amount } = req.body;

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Get user and locks the row
    const userResult = await client.query({
      name: 'get-user-balance-lock',
      text: 'SELECT balance FROM users WHERE email = $1 FOR UPDATE',
      values: [email],
    });

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    const currentBalance = parseInt(userResult.rows[0].balance, 10);
    const newBalance = currentBalance + top_up_amount;

    // Update balance
    await client.query({
      name: 'update-user-balance',
      text: 'UPDATE users SET balance = $1 WHERE email = $2',
      values: [newBalance, email],
    });

    // Generate unique invoice number
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = `INV${d}${m}${y}-${randomSuffix}`;

    // Insert transaction record
    await client.query({
      name: 'insert-topup-transaction',
      text: 'INSERT INTO transactions (invoice_number, email, transaction_type, total_amount, description, created_on) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [invoiceNumber, email, 'TOPUP', top_up_amount, 'Top Up balance', now],
    });

    await client.query('COMMIT');

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: newBalance,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Top up error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  } finally {
    client.release();
  }
}

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;
  const { service_code } = req.body;

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Get service details
    const serviceResult = await client.query({
      name: 'get-service-tariff',
      text: 'SELECT service_name, service_tariff FROM services WHERE service_code = $1',
      values: [service_code],
    });

    if (serviceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Service ataus Layanan tidak ditemukan', // Matches exact Swagger spelling
        data: null,
      });
    }

    const { service_name, service_tariff } = serviceResult.rows[0];
    const tariff = parseInt(service_tariff, 10);

    // Get user and locks the row
    const userResult = await client.query({
      name: 'get-user-balance-lock-payment',
      text: 'SELECT balance FROM users WHERE email = $1 FOR UPDATE',
      values: [email],
    });

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    const currentBalance = parseInt(userResult.rows[0].balance, 10);

    if (currentBalance < tariff) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null,
      });
    }

    const newBalance = currentBalance - tariff;

    // Update balance
    await client.query({
      name: 'update-user-balance-after-payment',
      text: 'UPDATE users SET balance = $1 WHERE email = $2',
      values: [newBalance, email],
    });

    // Generate unique invoice number
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = `INV${d}${m}${y}-${randomSuffix}`;

    // Insert transaction record
    await client.query({
      name: 'insert-payment-transaction',
      text: 'INSERT INTO transactions (invoice_number, email, transaction_type, service_code, total_amount, description, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [invoiceNumber, email, 'PAYMENT', service_code, tariff, service_name, now],
    });

    await client.query('COMMIT');

    return res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: invoiceNumber,
        service_code: service_code,
        service_name: service_name,
        transaction_type: 'PAYMENT',
        total_amount: tariff,
        created_on: now.toISOString(),
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Payment error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  } finally {
    client.release();
  }
}

export async function getTransactionHistory(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;
  const limitParam = req.query.limit;
  const offsetParam = req.query.offset;

  try {
    const limit = limitParam !== undefined ? parseInt(limitParam as string, 10) : undefined;
    const offset = offsetParam !== undefined ? parseInt(offsetParam as string, 10) : 0;

    let historyResult;
    if (limit !== undefined) {
      historyResult = await query(
        'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE email = $1 ORDER BY created_on DESC LIMIT $2 OFFSET $3',
        [email, limit, offset],
        'get-transactions-history-limited'
      );
    } else {
      historyResult = await query(
        'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE email = $1 ORDER BY created_on DESC OFFSET $2',
        [email, offset],
        'get-transactions-history-all'
      );
    }

    const records = historyResult.rows.map((row) => ({
      invoice_number: row.invoice_number,
      transaction_type: row.transaction_type,
      description: row.description,
      total_amount: parseInt(row.total_amount, 10),
      created_on: new Date(row.created_on).toISOString(),
    }));

    return res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offset,
        limit: limit !== undefined ? limit : null,
        records: records,
      },
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}
