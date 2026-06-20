'use client';

import React from 'react';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { ChannelList } from '@/components/Channels/ChannelList';

export default function ChannelsPage() {
  return (
    <MiniAppShell title="SamSkrithi Channels">
      <div className="pt-2 pb-6">
        <div className="section-title mb-3">Follow the stream</div>
        <ChannelList />
      </div>
      <BottomNav />
    </MiniAppShell>
  );
}
