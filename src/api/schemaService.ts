import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  is_identity: string;
  is_primary: boolean;
}

export interface TableInfo {
  table_name: string;
  columns: TableColumn[];
  policies: PolicyInfo[];
}

export interface PolicyInfo {
  policy_name: string;
  operation: string;
  role: string;
  definition: string;
}

/**
 * Fetches schema information from Supabase
 * @returns Promise with database schema information
 */
export async function fetchDatabaseSchema(): Promise<{ success: boolean; data?: TableInfo[]; error?: string }> {
  try {
    // First, fetch all tables in the public schema
    let { data: tablesData, error: tablesError } = await supabase
      .rpc('get_tables');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return {
        success: false,
        error: tablesError.message
      };
    }

    if (!tablesData || tablesData.length === 0) {
      // Try a direct query approach as fallback
      const { data: tablesRaw, error: fallbackError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');

      if (fallbackError) {
        console.error('Error in fallback table fetch:', fallbackError);
        return {
          success: false,
          error: 'Could not access schema information. This may be due to permission restrictions.'
        };
      }

      if (!tablesRaw || tablesRaw.length === 0) {
        return {
          success: true,
          data: [],
          error: 'No tables found in the public schema'
        };
      }

      // Format the fallback data to match expected structure
      tablesData = tablesRaw.map(t => ({ table_name: t.tablename }));
    }

    // Process each table to get columns and policies
    const tablesInfo: TableInfo[] = [];
    
    for (const table of tablesData) {
      try {
        // Fetch columns for the table
        const { data: columns, error: columnsError } = await supabase
          .rpc('get_table_columns', { table_name: table.table_name });

        if (columnsError) {
          console.error(`Error fetching columns for ${table.table_name}:`, columnsError);
          continue;
        }

        // Fetch RLS policies for the table
        const { data: policies, error: policiesError } = await supabase
          .rpc('get_table_policies', { table_name: table.table_name });

        if (policiesError) {
          console.error(`Error fetching policies for ${table.table_name}:`, policiesError);
        }

        tablesInfo.push({
          table_name: table.table_name,
          columns: columns || [],
          policies: policies || []
        });
      } catch (error) {
        console.error(`Error processing table ${table.table_name}:`, error);
      }
    }

    return {
      success: true,
      data: tablesInfo
    };
  } catch (error: any) {
    console.error('Unexpected error fetching schema:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while fetching schema information'
    };
  }
}

/**
 * Alternative implementation using raw SQL queries
 * This can be used if the RPC methods aren't available
 */
export async function fetchSchemaWithSQL(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Get tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (tablesError) {
      return {
        success: false,
        error: tablesError.message
      };
    }

    const schemaData = [];
    
    for (const table of tables || []) {
      // Get columns for each table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name);

      if (columnsError) {
        console.error(`Error fetching columns for ${table.table_name}:`, columnsError);
        continue;
      }

      schemaData.push({
        table_name: table.table_name,
        columns: columns || []
      });
    }

    return {
      success: true,
      data: schemaData
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}