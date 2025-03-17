import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Table, Shield, HelpCircle, ChevronDown, ChevronRight, Search, RefreshCw } from 'lucide-react';
import { fetchDatabaseSchema, TableInfo } from '../api/schemaService';
import toast from 'react-hot-toast';

export default function SchemaViewer() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSchemaData();
  }, []);

  const loadSchemaData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchDatabaseSchema();
      
      if (result.success && result.data) {
        setTables(result.data);
        
        // Initialize expanded state
        const expanded: Record<string, boolean> = {};
        result.data.forEach(table => {
          expanded[table.table_name] = false;
        });
        setExpandedTables(expanded);
      } else {
        setError(result.error || 'Failed to fetch schema information');
        toast.error(result.error || 'Failed to fetch schema information');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to load schema data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSchemaData();
  };

  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const filteredTables = tables.filter(table => 
    table.table_name.toLowerCase().includes(search.toLowerCase()) ||
    table.columns.some(col => col.column_name.toLowerCase().includes(search.toLowerCase()))
  );

  const getColumnTypeDisplay = (dataType: string) => {
    // Format data type for display
    let display = dataType;
    
    // Format common types for better readability
    if (dataType.includes('character varying')) {
      display = 'varchar';
    } else if (dataType === 'timestamp with time zone') {
      display = 'timestamptz';
    } else if (dataType === 'timestamp without time zone') {
      display = 'timestamp';
    }
    
    return display;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to home
        </Link>
        
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-indigo-500 mr-4" />
              <h1 className="text-3xl font-bold text-white">Database Schema</h1>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <p className="text-lg text-slate-300 mb-8">
            Explore the database structure, tables, columns, and relationships.
          </p>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search tables and columns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mr-4"></div>
              <span className="text-slate-300 text-lg">Loading schema information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 text-center">
              <HelpCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Schema</h3>
              <p className="text-slate-300 mb-4">{error}</p>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                This could be due to permission restrictions or if the required database functions are not available.
                You may need admin privileges or additional Supabase setup to access schema information.
              </p>
            </div>
          ) : tables.length === 0 ? (
            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Tables Found</h3>
              <p className="text-slate-300">
                No tables were found in the public schema of your database.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTables.map(table => (
                <div key={table.table_name} className="bg-slate-700 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div 
                    className="p-4 bg-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-500 transition-colors"
                    onClick={() => toggleTableExpand(table.table_name)}
                  >
                    <div className="flex items-center">
                      <Table className="h-5 w-5 text-indigo-400 mr-3" />
                      <h3 className="text-lg font-semibold text-white">{table.table_name}</h3>
                      {table.policies && table.policies.length > 0 && (
                        <div className="ml-3 px-2 py-1 bg-indigo-900/50 rounded-md text-xs text-indigo-300 flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          RLS: {table.policies.length} {table.policies.length === 1 ? 'policy' : 'policies'}
                        </div>
                      )}
                    </div>
                    <div>
                      {expandedTables[table.table_name] ? (
                        <ChevronDown className="h-5 w-5 text-slate-300" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                  </div>
                  
                  {/* Table Details */}
                  {expandedTables[table.table_name] && (
                    <div className="p-4">
                      {/* Columns */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Columns</h4>
                        <div className="bg-slate-800 rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Nullable</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Default</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Primary</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {table.columns.map((column, i) => (
                                <tr key={column.column_name} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                                  <td className="px-4 py-3 text-sm text-white font-medium">{column.column_name}</td>
                                  <td className="px-4 py-3 text-sm text-indigo-300">{getColumnTypeDisplay(column.data_type)}</td>
                                  <td className="px-4 py-3 text-sm">
                                    {column.is_nullable === 'YES' ? (
                                      <span className="text-amber-400">Nullable</span>
                                    ) : (
                                      <span className="text-green-400">Not Null</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-pre-wrap break-all max-w-xs">
                                    {column.column_default || <span className="text-slate-500">—</span>}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {column.is_primary ? (
                                      <span className="text-green-400">Yes</span>
                                    ) : (
                                      <span className="text-slate-500">No</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Policies */}
                      {table.policies && table.policies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Row Level Security Policies</h4>
                          <div className="bg-slate-800 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-700">
                              <thead className="bg-slate-800">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Policy Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Operation</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Definition</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-700">
                                {table.policies.map((policy, i) => (
                                  <tr key={policy.policy_name} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                                    <td className="px-4 py-3 text-sm text-white">{policy.policy_name}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        policy.operation.includes('SELECT') ? 'bg-blue-900/50 text-blue-300' :
                                        policy.operation.includes('INSERT') ? 'bg-green-900/50 text-green-300' :
                                        policy.operation.includes('UPDATE') ? 'bg-amber-900/50 text-amber-300' :
                                        policy.operation.includes('DELETE') ? 'bg-red-900/50 text-red-300' :
                                        'bg-slate-900/50 text-slate-300'
                                      }`}>
                                        {policy.operation}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-indigo-300">{policy.role}</td>
                                    <td className="px-4 py-3 text-sm text-slate-300 whitespace-pre-wrap break-all">
                                      <code className="bg-slate-900/50 px-1 py-0.5 rounded text-xs">
                                        {policy.definition}
                                      </code>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}