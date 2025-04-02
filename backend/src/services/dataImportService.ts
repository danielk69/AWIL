import ExcelJS from 'exceljs';
import pool from '../config/database';
import { Theme, Subtheme, Category, Name } from '../types';

export const importData = async (file: Express.Multer.File): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file');
  }

  const rows = worksheet.getRows(2, worksheet.rowCount - 1); // Skip header row
  if (!rows) {
    throw new Error('No data found in the Excel file');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const row of rows) {
      const themeName = row.getCell(1).text;
      const subthemeName = row.getCell(2).text;
      const categoryName = row.getCell(3).text;
      const name = row.getCell(4).text;

      // Insert theme
      const themeResult = await client.query(
        'INSERT INTO themes (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [themeName]
      );
      const themeId = themeResult.rows[0].id;

      // Insert subtheme
      const subthemeResult = await client.query(
        'INSERT INTO subthemes (name, theme_id) VALUES ($1, $2) ON CONFLICT (name, theme_id) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [subthemeName, themeId]
      );
      const subthemeId = subthemeResult.rows[0].id;

      // Insert category
      const categoryResult = await client.query(
        'INSERT INTO categories (name, subtheme_id) VALUES ($1, $2) ON CONFLICT (name, subtheme_id) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [categoryName, subthemeId]
      );
      const categoryId = categoryResult.rows[0].id;

      // Insert name
      const nameResult = await client.query(
        'INSERT INTO names (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [name]
      );
      const nameId = nameResult.rows[0].id;

      // Link name to category
      await client.query(
        'INSERT INTO name_categories (name_id, category_id) VALUES ($1, $2) ON CONFLICT (name_id, category_id) DO NOTHING',
        [nameId, categoryId]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}; 