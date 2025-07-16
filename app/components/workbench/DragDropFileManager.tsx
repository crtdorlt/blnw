import { memo, useCallback, useState, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { IconButton } from '~/components/ui/IconButton';

interface DragDropFileManagerProps {
  onFileUpload: (files: FileList) => void;
  onCreateFile: (name: string, content: string) => void;
  onCreateFolder: (name: string) => void;
  className?: string;
}

export const DragDropFileManager = memo(({ 
  onFileUpload, 
  onCreateFile, 
  onCreateFolder, 
  className 
}: DragDropFileManagerProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleCreateFile = useCallback(() => {
    const name = prompt('Enter file name:');
    if (name) {
      onCreateFile(name, '');
    }
    setShowCreateMenu(false);
  }, [onCreateFile]);

  const handleCreateFolder = useCallback(() => {
    const name = prompt('Enter folder name:');
    if (name) {
      onCreateFolder(name);
    }
    setShowCreateMenu(false);
  }, [onCreateFolder]);

  return (
    <div className={classNames('relative', className)}>
      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-bolt-elements-background-depth-1 bg-opacity-90 border-2 border-dashed border-bolt-elements-borderColorActive rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="i-ph:upload-simple text-4xl text-bolt-elements-textSecondary mb-2" />
            <p className="text-bolt-elements-textPrimary font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* File Manager Header */}
      <div 
        className="flex items-center justify-between p-2 border-b border-bolt-elements-borderColor"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-2">
          <div className="i-ph:folder-duotone text-lg text-bolt-elements-textSecondary" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">Files</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Upload Button */}
          <IconButton
            icon="i-ph:upload-simple"
            size="sm"
            title="Upload Files"
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Create Menu */}
          <div className="relative">
            <IconButton
              icon="i-ph:plus"
              size="sm"
              title="Create New"
              onClick={() => setShowCreateMenu(!showCreateMenu)}
            />

            {showCreateMenu && (
              <div className="absolute right-0 top-8 z-10 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md shadow-lg min-w-[120px]">
                <button
                  onClick={handleCreateFile}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2"
                >
                  <div className="i-ph:file-plus" />
                  New File
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2"
                >
                  <div className="i-ph:folder-plus" />
                  New Folder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
});