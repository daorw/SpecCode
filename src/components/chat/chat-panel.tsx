'use client';

import { useEffect, useRef } from 'react';
import { Agent } from '@mariozechner/pi-agent-core';
import { ChatPanel, AppStorage, IndexedDBStorageBackend, SettingsStore, ProviderKeysStore, SessionsStore, CustomProvidersStore, setAppStorage, defaultConvertToLlm, ApiKeyPromptDialog } from '@mariozechner/pi-web-ui';

interface ChatPanelWrapperProps {
  agent: Agent;
}

export function ChatPanelWrapper({ agent }: ChatPanelWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<ChatPanel | null>(null);

  useEffect(() => {
    if (!containerRef.current || panelRef.current) return;

    const setup = async () => {
      const settings = new SettingsStore();
      const providerKeys = new ProviderKeysStore();
      const sessions = new SessionsStore();

      const backend = new IndexedDBStorageBackend({
        dbName: 'speccode',
        version: 1,
        stores: [
          settings.getConfig(),
          providerKeys.getConfig(),
          sessions.getConfig(),
          SessionsStore.getMetadataConfig(),
        ],
      });

      settings.setBackend(backend);
      providerKeys.setBackend(backend);
      sessions.setBackend(backend);

      const customProviders = new CustomProvidersStore();
      customProviders.setBackend(backend);

      const storage = new AppStorage(settings, providerKeys, sessions, customProviders, backend);
      setAppStorage(storage);

      const chatPanel = new ChatPanel();
      await chatPanel.setAgent(agent, {
        onApiKeyRequired: (provider: string) => ApiKeyPromptDialog.prompt(provider),
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(chatPanel);
      }
      panelRef.current = chatPanel;
    };

    setup().catch(console.error);

    return () => {
      panelRef.current?.remove();
      panelRef.current = null;
    };
  }, [agent]);

  return <div ref={containerRef} className="h-full w-full" />;
}
