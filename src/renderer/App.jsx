import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import RecentSessions from './components/RecentSessions';
import ExportDialog from './components/ExportDialog';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [browserStatus, setBrowserStatus] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [sessionToExport, setSessionToExport] = useState(null);
  const [exportError, setExportError] = useState(null);
  const statusTimeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const loadSessions = async () => {
    try {
      const data = await window.electronAPI.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleOpenBrowser = async (platform, options) => {
    setIsLoading(true);
    setBrowserStatus({ status: 'opening', message: 'Opening browser...' });

    try {
      const result = await window.electronAPI.openBrowser({
        platform: platform.id,
        options,
      });

      if (result.success) {
        setBrowserStatus({
          status: 'opened',
          message: 'Browser opened. Please login manually.',
          data: result
        });
      } else {
        setBrowserStatus({
          status: 'error',
          message: result.error || 'Failed to open browser'
        });
      }
    } catch (error) {
      console.error('Browser error:', error);
      setBrowserStatus({
        status: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractComplete = async (sessionData) => {
    try {
      const newSession = await window.electronAPI.saveSession(sessionData);
      await loadSessions();
      setBrowserStatus({
        status: 'success',
        message: 'Cookies extracted successfully!'
      });

      // Clear existing timeout if any
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }

      // Reset after 2 seconds
      statusTimeoutRef.current = setTimeout(() => {
        setBrowserStatus(null);
        statusTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error('Failed to save session:', error);
      setBrowserStatus({
        status: 'error',
        message: 'Failed to save session'
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await window.electronAPI.deleteSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleExportSession = (session) => {
    setSessionToExport(session);
    setExportDialogOpen(true);
  };

  const handleExportConfirm = async (format, exportPath) => {
    try {
      const result = await window.electronAPI.exportSession({
        sessionId: sessionToExport.id,
        format,
        exportPath,
      });

      if (result.success) {
        console.log('Exported to:', result.path);
        setExportDialogOpen(false);
        setSessionToExport(null);
        setExportError(null);
      } else if (!result.canceled) {
        console.error('Export failed:', result.error);
        const errorMessage = result.error || 'Unknown error';
        setExportError(`Export failed: ${errorMessage}`);

        // Clear error after 5 seconds
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        errorTimeoutRef.current = setTimeout(() => {
          setExportError(null);
          errorTimeoutRef.current = null;
        }, 5000);
      }
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error.message || 'Unknown error';
      setExportError(`Export error: ${errorMessage}`);

      // Clear error after 5 seconds
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setExportError(null);
        errorTimeoutRef.current = null;
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <h1 className="text-xl font-bold text-gray-800">Platform Cookie Extractor</h1>
        </div>
        <div className="text-sm text-gray-500">
          macOS • v1.0.0
        </div>
      </div>

      {/* Export Error Notification */}
      {exportError && (
        <div className="fixed top-20 right-6 z-50 max-w-md animate-fade-in">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">❌</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Export Error</h3>
                <p className="text-sm text-red-800">{exportError}</p>
              </div>
              <button
                onClick={() => setExportError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <MainArea
              selectedPlatform={selectedPlatform}
              onOpenBrowser={handleOpenBrowser}
              onExtractComplete={handleExtractComplete}
              isLoading={isLoading}
              browserStatus={browserStatus}
            />
          </div>

          {/* Recent Sessions */}
          <div className="border-t border-gray-200 bg-white">
            <RecentSessions
              sessions={sessions}
              onExport={handleExportSession}
              onDelete={handleDeleteSession}
            />
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {exportDialogOpen && (
        <ExportDialog
          session={sessionToExport}
          onConfirm={handleExportConfirm}
          onCancel={() => {
            setExportDialogOpen(false);
            setSessionToExport(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
