import { Request, Response } from 'express';
import { query } from '../db/index.js';

export async function getBanners(req: Request, res: Response) {
  try {
    const result = await query(
      'SELECT banner_name, banner_image, description FROM banners',
      [],
      'get-banners'
    );

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get banners error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function getServices(req: Request, res: Response) {
  try {
    const result = await query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services',
      [],
      'get-services'
    );

    // Map service_tariff to integer to avoid returning strings from database BIGINT types
    const mappedServices = result.rows.map((row) => ({
      service_code: row.service_code,
      service_name: row.service_name,
      service_icon: row.service_icon,
      service_tariff: parseInt(row.service_tariff, 10),
    }));

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: mappedServices,
    });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}
