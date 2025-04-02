import xlsx from 'xlsx';
import pool from '../config/database';

interface SpreadsheetData {
  themes: string[];
  subthemes: string[];
  categories: string[];
  names: string[];
  assignments: { [key: string]: string[] };
}

export async function importSpreadsheet(filePath: string): Promise<void> {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const data = rawData as (string | undefined)[][];

    // Parse the data
    const spreadsheetData: SpreadsheetData = {
      themes: data[0] as string[],
      subthemes: data[1] as string[],
      categories: data[2] as string[],
      names: data.slice(3).map(row => row[0] as string),
      assignments: {}
    };

    // Process assignments
    data.slice(3).forEach((row: (string | undefined)[], rowIndex: number) => {
      const name = row[0] as string;
      spreadsheetData.assignments[name] = [];
      row.slice(1).forEach((cell: string | undefined, colIndex: number) => {
        if (cell === 'x') {
          spreadsheetData.assignments[name].push(spreadsheetData.categories[colIndex]);
        }
      });
    });

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert themes
      const themeIds: { [key: string]: number } = {};
      for (const theme of spreadsheetData.themes) {
        const [result] = await connection.execute(
          'INSERT INTO themes (name) VALUES (?)',
          [theme]
        );
        themeIds[theme] = (result as any).insertId;
      }

      // Insert subthemes
      const subthemeIds: { [key: string]: number } = {};
      for (let i = 0; i < spreadsheetData.subthemes.length; i++) {
        const subtheme = spreadsheetData.subthemes[i];
        const theme = spreadsheetData.themes[i];
        const [result] = await connection.execute(
          'INSERT INTO subthemes (theme_id, name) VALUES (?, ?)',
          [themeIds[theme], subtheme]
        );
        subthemeIds[subtheme] = (result as any).insertId;
      }

      // Insert categories
      const categoryIds: { [key: string]: number } = {};
      for (let i = 0; i < spreadsheetData.categories.length; i++) {
        const category = spreadsheetData.categories[i];
        const subtheme = spreadsheetData.subthemes[i];
        const [result] = await connection.execute(
          'INSERT INTO categories (subtheme_id, name) VALUES (?, ?)',
          [subthemeIds[subtheme], category]
        );
        categoryIds[category] = (result as any).insertId;
      }

      // Insert names and their assignments
      for (const name of spreadsheetData.names) {
        const [result] = await connection.execute(
          'INSERT INTO names (name) VALUES (?)',
          [name]
        );
        const nameId = (result as any).insertId;

        // Insert name-category assignments
        for (const category of spreadsheetData.assignments[name]) {
          await connection.execute(
            'INSERT INTO name_categories (name_id, category_id) VALUES (?, ?)',
            [nameId, categoryIds[category]]
          );
        }
      }

      // Commit transaction
      await connection.commit();
      console.log('Spreadsheet data imported successfully');
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error importing spreadsheet:', error);
    throw error;
  }
} 