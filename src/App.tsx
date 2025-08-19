import { useState, useEffect } from 'react'
import { MessageSquare, Users, AlertCircle } from 'lucide-react'
import { TableViewer } from './components/TableViewer'
import { useTablesStatus } from './hooks/useTablesStatus'

const TABLES = [
  { id: 'telegram_message', name: 'Посты / Сообщения', icon: MessageSquare, description: 'Telegram посты и сообщения' },
  { id: 'tg_objects', name: 'Каналы / Чаты / Форумы', icon: Users, description: 'Telegram каналы, чаты и форумы' }
]

function App() {
  const [activeTable, setActiveTable] = useState('telegram_message')
  const { data: tablesStatus, isLoading: statusLoading } = useTablesStatus()
  
  // Auto-switch to first available table if current table is empty
  useEffect(() => {
    if (tablesStatus && !statusLoading) {
      const currentTableHasData = tablesStatus[activeTable as keyof typeof tablesStatus]?.has_data
      
      if (!currentTableHasData) {
        // Find first table with data
        const availableTable = TABLES.find(table => 
          tablesStatus[table.id as keyof typeof tablesStatus]?.has_data
        )
        
        if (availableTable && availableTable.id !== activeTable) {
          setActiveTable(availableTable.id)
        }
      }
    }
  }, [tablesStatus, activeTable, statusLoading])
  
  // Check if all tables are empty
  const allTablesEmpty = tablesStatus && TABLES.every(table => 
    !tablesStatus[table.id as keyof typeof tablesStatus]?.has_data
  )
  
  // Debug logs
  console.log('App State:', {
    activeTable,
    tablesStatus,
    statusLoading,
    allTablesEmpty
  })

  return (
    <div className="min-h-screen bg-tgate-dark">
      <div className="tgate-panel border-b border-tgate-border shadow-tgate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-8">
              <img src="./logo.png" alt="TGate Logo" className="h-[120px] w-auto object-contain max-w-[400px]" />
              <div className="h-[60px] w-0.5 bg-gradient-to-b from-transparent via-tgate-text-dark to-transparent rounded opacity-80"></div>
              <div className="flex flex-col">
                <h1 className="text-4xl font-normal text-tgate-text-dark leading-none">Data</h1>
                <h1 className="text-4xl font-normal text-tgate-text-dark leading-none">Viewer</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show message if all tables are empty */}
        {allTablesEmpty && (
          <div className="mb-6 bg-tgate-panel border border-tgate-border rounded-xl p-6 shadow-tgate">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-400 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-300">Нет данных</h3>
                <p className="text-tgate-text-muted">Все таблицы пусты. Данные будут отображены после их появления в базе данных.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <nav className="flex space-x-1 bg-tgate-panel rounded-xl p-2 shadow-tgate border border-tgate-border">
            {TABLES.map((table) => {
              const Icon = table.icon
              const hasData = tablesStatus ? tablesStatus[table.id as keyof typeof tablesStatus]?.has_data : true
              const isDisabled = !hasData
              
              return (
                <button
                  key={table.id}
                  onClick={() => hasData && setActiveTable(table.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isDisabled 
                      ? 'opacity-50 cursor-not-allowed bg-tgate-dark text-tgate-text-dark'
                      : activeTable === table.id 
                      ? 'bg-tgate-primary/20 text-tgate-primary shadow-md border border-tgate-primary/30' 
                      : 'text-tgate-text hover:text-tgate-primary hover:bg-tgate-primary/10'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium flex items-center gap-2">
                      {table.name}
                      {!hasData && <span className="text-xs bg-tgate-dark px-2 py-0.5 rounded-full text-tgate-text-dark">Пустая</span>}
                    </div>
                    <div className="text-xs opacity-75">{table.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="tgate-panel rounded-xl shadow-tgate">
          <TableViewer tableName={activeTable} />
        </div>
      </div>
    </div>
  )
}

export default App