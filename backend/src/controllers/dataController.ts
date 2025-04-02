import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import multer from 'multer';
import pool from '../config/database';
import { importSpreadsheet } from '../utils/spreadsheetImport';

interface Theme extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface Subtheme extends RowDataPacket {
  id: number;
  theme_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface Category extends RowDataPacket {
  id: number;
  subtheme_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface Name extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface NameCategory extends RowDataPacket {
  name_id: number;
  category_id: number;
  created_at: Date;
}

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

export const getThemes = async (req: Request, res: Response) => {
  try {
    const [themes] = await pool.execute<Theme[]>('SELECT * FROM themes');
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching themes', error });
  }
};

export const getSubthemes = async (req: Request, res: Response) => {
  try {
    const { themeId } = req.params;
    const [subthemes] = await pool.execute<Subtheme[]>(
      'SELECT * FROM subthemes WHERE theme_id = ?',
      [themeId]
    );
    res.json(subthemes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subthemes', error });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { subthemeId } = req.params;
    const [categories] = await pool.execute<Category[]>(
      'SELECT * FROM categories WHERE subtheme_id = ?',
      [subthemeId]
    );
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const getRandomName = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const [names] = await pool.execute<Name[]>(
      `SELECT n.name 
       FROM names n 
       JOIN name_categories nc ON n.id = nc.name_id 
       WHERE nc.category_id = ? 
       ORDER BY RAND() 
       LIMIT 1`,
      [categoryId]
    );
    res.json(names[0] || { message: 'No names found for this category' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random name', error });
  }
};

export const getAllData = async (req: Request, res: Response) => {
  try {
    const [themes] = await pool.execute<Theme[]>('SELECT * FROM themes');
    const [subthemes] = await pool.execute<Subtheme[]>('SELECT * FROM subthemes');
    const [categories] = await pool.execute<Category[]>('SELECT * FROM categories');
    const [names] = await pool.execute<Name[]>('SELECT * FROM names');
    const [nameCategories] = await pool.execute<NameCategory[]>('SELECT * FROM name_categories');

    res.json({
      themes,
      subthemes,
      categories,
      names,
      nameCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all data', error });
  }
};

export const importData = async (req: FileRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await importSpreadsheet(req.file.path);
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error importing data', error });
  }
};

export const addTheme = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO themes (name) VALUES (?)',
      [name]
    );
    res.json({ id: (result as any).insertId, name });
  } catch (error) {
    res.status(500).json({ message: 'Error adding theme', error });
  }
};

export const addSubtheme = async (req: Request, res: Response) => {
  try {
    const { themeId, name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO subthemes (theme_id, name) VALUES (?, ?)',
      [themeId, name]
    );
    res.json({ id: (result as any).insertId, themeId, name });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subtheme', error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { subthemeId, name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO categories (subtheme_id, name) VALUES (?, ?)',
      [subthemeId, name]
    );
    res.json({ id: (result as any).insertId, subthemeId, name });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

export const addName = async (req: Request, res: Response) => {
  try {
    const { name, categoryIds } = req.body;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        'INSERT INTO names (name) VALUES (?)',
        [name]
      );
      const nameId = (result as any).insertId;

      for (const categoryId of categoryIds) {
        await connection.execute(
          'INSERT INTO name_categories (name_id, category_id) VALUES (?, ?)',
          [nameId, categoryId]
        );
      }

      await connection.commit();
      res.json({ id: nameId, name, categoryIds });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding name', error });
  }
};

export const deleteName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM names WHERE id = ?', [id]);
    res.json({ message: 'Name deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting name', error });
  }
}; 