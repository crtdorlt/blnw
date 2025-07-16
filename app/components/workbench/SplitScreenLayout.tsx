import { memo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { classNames } from '~/utils/classNames';
import { IconButton } from '~/components/ui/IconButton';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
  defaultSizes?: [number, number];
  minSizes?: [number, number];
}

export const SplitScreenLayout = memo(({
  leftPanel,
  rightPanel,
  className,
  defaultSizes = [50, 50],
  minSizes = [20, 20]
}: SplitScreenLayoutProps) => {
  const [isVertical, setIsVertical] = useState(false);
  const [showBoth, setShowBoth] = useState(true);
  const [activePanel, setActivePanel] = useState<'left' | 'right'>('left');

  const toggleLayout = () => {
    setIsVertical(!isVertical);
  };

  const toggleSinglePanel = () => {
    if (showBoth) {
      setShowBoth(false);
    } else {
      setShowBoth(true);
    }
  };

  const switchPanel = () => {
    setActivePanel(activePanel === 'left' ? 'right' : 'left');
  };

  return (
    <div className={classNames('h-full flex flex-col', className)}>
      {/* Layout Controls */}
      <div className="flex items-center justify-between p-2 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-2">
        <div className="flex items-center gap-1">
          <IconButton
            icon={isVertical ? 'i-ph:columns' : 'i-ph:rows'}
            size="sm"
            title={isVertical ? 'Switch to Horizontal' : 'Switch to Vertical'}
            onClick={toggleLayout}
          />
          <IconButton
            icon={showBoth ? 'i-ph:square-split-horizontal' : 'i-ph:square'}
            size="sm"
            title={showBoth ? 'Single Panel' : 'Split View'}
            onClick={toggleSinglePanel}
          />
          {!showBoth && (
            <IconButton
              icon="i-ph:swap"
              size="sm"
              title="Switch Panel"
              onClick={switchPanel}
            />
          )}
        </div>

        <div className="text-xs text-bolt-elements-textSecondary">
          {showBoth ? (isVertical ? 'Vertical Split' : 'Horizontal Split') : 
           `${activePanel === 'left' ? 'Left' : 'Right'} Panel`}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {showBoth ? (
          <PanelGroup direction={isVertical ? 'vertical' : 'horizontal'}>
            <Panel defaultSize={defaultSizes[0]} minSize={minSizes[0]}>
              <div className="h-full overflow-hidden">
                {leftPanel}
              </div>
            </Panel>
            
            <PanelResizeHandle className="bg-bolt-elements-borderColor hover:bg-bolt-elements-borderColorActive transition-colors" />
            
            <Panel defaultSize={defaultSizes[1]} minSize={minSizes[1]}>
              <div className="h-full overflow-hidden">
                {rightPanel}
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full overflow-hidden">
            {activePanel === 'left' ? leftPanel : rightPanel}
          </div>
        )}
      </div>
    </div>
  );
});