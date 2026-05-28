import { Product, Document } from '../types';

// The spreadsheet ID provided by the user
export const SPREADSHEET_ID = '1yyf7AoArn-RgOfFQpo6DrcMPQdvDSDdAVydsZOhJi7I';

// Safe parser for the Google visualization API JSON feed (No API Key required for viewing!)
export async function fetchSheetDataPublic(sheetName: string): Promise<any[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet ${sheetName}`);
    }
    const text = await response.text();
    
    // Google Visualization API returns a wrapper: /*google.visualization.Query.setResponse({"version":...});*/
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match) {
      throw new Error('Invalid JSON wrapper format');
    }
    
    const obj = JSON.parse(match[1]);
    const table = obj.table;
    if (!table || !table.cols || !table.rows) {
      return [];
    }
    
    const headers = table.cols.map((col: any) => col.label || col.id);
    const rows = table.rows.map((row: any) => {
      const rowData: Record<string, any> = {};
      row.c.forEach((cell: any, idx: number) => {
        const headerName = headers[idx];
        if (headerName) {
          // extract cell value
          rowData[headerName] = cell ? cell.v : null;
        }
      });
      return rowData;
    });
    
    return rows;
  } catch (err) {
    console.warn(`Public load failed for sheet ${sheetName}:`, err);
    throw err;
  }
}

// REST endpoints using OAuth access token
export async function createSheetTab(accessToken: string, title: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: title,
                },
              },
            },
          ],
        }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function writeRowsToSheet(
  accessToken: string,
  sheetName: string,
  range: string,
  values: any[][]
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName + '!' + range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      }
    );
    return response.ok;
  } catch (err) {
    console.error(`Failed to write rows to sheet ${sheetName}:`, err);
    return false;
  }
}

export async function appendRowsToSheet(
  accessToken: string,
  sheetName: string,
  range: string,
  values: any[][]
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName + '!' + range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      }
    );
    return response.ok;
  } catch (err) {
    console.error(`Failed to append rows to sheet ${sheetName}:`, err);
    return false;
  }
}

// Clear and replace entire range
export async function overwriteSheetData(
  accessToken: string,
  sheetName: string,
  headers: string[],
  rows: any[][]
): Promise<boolean> {
  try {
    // 1. Clear sheet values
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:clear`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    // 2. Write headers + data starting from A1
    const allValues = [headers, ...rows];
    return await writeRowsToSheet(accessToken, sheetName, `A1`, allValues);
  } catch (err) {
    console.error(`Overwrite failed for sheet ${sheetName}:`, err);
    return false;
  }
}

// Check spreadsheet sheets names and create if missing
export async function ensureWorkbookStructure(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Could not fetch workbook metadata');
    }
    
    const meta = await response.json();
    const existingSheets = meta.sheets?.map((s: any) => s.properties?.title as string) || [];
    
    const requiredSheets = ['Products', 'Quotes', 'Admins', 'Documents'];
    const createdList: string[] = [];
    
    for (const req of requiredSheets) {
      if (!existingSheets.includes(req)) {
        const success = await createSheetTab(accessToken, req);
        if (success) {
          createdList.push(req);
        }
      }
    }
    
    return createdList;
  } catch (err) {
    console.error('ensureWorkbookStructure failed:', err);
    return [];
  }
}

// Convert spreadsheets rows to type Product
export function rawRowsToProducts(rows: any[]): Product[] {
  return rows.map((r, index) => {
    // Determine category key
    let cat = String(r.category || 'robot').trim().toLowerCase();
    if (cat === 'trạm hàn' || cat.includes('hàn') || cat === 'han') {
      cat = 'han';
    } else if (cat === 'tô vít' || cat.includes('vít') || cat === 'van-vit') {
      cat = 'van-vit';
    } else if (cat === 'keo' || cat.includes('keo') || cat === 'keo') {
      cat = 'keo';
    } else {
      cat = 'robot';
    }

    const prodName = String(r.name || 'Unnamed Product');
    const pdfUrl = String(r.pdfUrl || '').trim();
    const docUrl = String(r.docUrl || '').trim();
    const documents: Array<{ name: string; type: string; size: string; url?: string }> = [];
    
    if (pdfUrl) {
      documents.push({ name: `${prodName} - Technical Catalog`, type: 'PDF', size: '1.4 MB', url: pdfUrl });
    }
    if (docUrl) {
      documents.push({ name: `${prodName} - Operation Sheet`, type: 'Excel/Word', size: '0.8 MB', url: docUrl });
    }

    let activeStatus = 1;
    const rawStatus = String(r.status ?? '1').trim().toLowerCase();
    if (rawStatus === '0' || rawStatus === 'deactive' || rawStatus === 'inactive') {
      activeStatus = 0;
    }

    const createAtVal = r.create_at ? String(r.create_at) : (r.created_at ? String(r.created_at) : '');
    const updateAtVal = r.update_at ? String(r.update_at) : (r.updated_at ? String(r.updated_at) : '');

    return {
      id: String(r.id || `sheet-prod-${index}`),
      name: prodName,
      sku: String(r.sku || `SKU-${index}`),
      brand: String(r.brand || 'T&T Vina'),
      category: cat,
      image: String(r.image || 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800'),
      stock: parseInt(r.stock) || 0,
      status: (parseInt(r.stock) || 0) > 20 ? 'In Stock' : ((parseInt(r.stock) || 0) > 0 ? 'Low Stock' : 'Out of Stock'),
      price: String(r.price || 'Báo giá'),
      shortDesc: String(r.shortDesc || ''),
      documents: documents,
      activeStatus: activeStatus,
      create_at: createAtVal,
      update_at: updateAtVal
    };
  });
}

// Convert spreadsheet rows to type Document
export function rawRowsToDocuments(rows: any[]): Document[] {
  return rows.map((r, index) => ({
    id: String(r.id || `doc-${index}`),
    title: String(r.title || 'Untitled Document'),
    sku: String(r.sku || 'N/A'),
    size: String(r.size || '1.2 MB'),
    category: String(r.category || 'Catalog tổng hợp'),
    updatedAt: String(r.updatedAt || '27/05/2026'),
    downloadCount: parseInt(r.downloadCount) || 10,
  }));
}
