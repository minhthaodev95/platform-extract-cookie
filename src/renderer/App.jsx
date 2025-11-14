import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import RecentSessions from './components/RecentSessions';
import ExportDialog from './components/ExportDialog';

const { ipcRenderer } = window.require('electron');

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [browserStatus, setBrowserStatus] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [sessionToExport, setSessionToExport] = useState(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await ipcRenderer.invoke('get-sessions');
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleOpenBrowser = async (platform, options) => {
    setIsLoading(true);
    setBrowserStatus({ status: 'opening', message: 'Opening browser...' });

    try {
      const result = await ipcRenderer.invoke('open-browser', {
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
      const newSession = await ipcRenderer.invoke('save-session', sessionData);
      await loadSessions();
      setBrowserStatus({
        status: 'success',
        message: 'Cookies extracted successfully!'
      });

      // Reset after 2 seconds
      setTimeout(() => {
        setBrowserStatus(null);
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
      await ipcRenderer.invoke('delete-session', sessionId);
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
      const result = await ipcRenderer.invoke('export-session', {
        sessionId: sessionToExport.id,
        format,
        exportPath,
      });

      if (result.success) {
        console.log('Exported to:', result.path);
        setExportDialogOpen(false);
        setSessionToExport(null);
      } else if (!result.canceled) {
        console.error('Export failed:', result.error);
        alert('Export failed: ' + result.error);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export error: ' + error.message);
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
