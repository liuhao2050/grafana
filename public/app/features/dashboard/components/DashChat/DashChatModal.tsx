import React from 'react';
import { Modal } from '@grafana/ui';
import { css } from '@emotion/css';
import { ChatDashboardModalProps } from './types';
import { Chat } from '@grafana/runtime';

export const DashboardChatModal: React.FC<ChatDashboardModalProps> = ({ dashboard, onDismiss, onSaveSuccess }) => {
  const chat = <Chat contentTypeId={2} objectId={dashboard.uid} />;

  return (
    <>
      <Modal
        isOpen={true}
        title="Dashboard chat"
        icon="save"
        onDismiss={onDismiss}
        className={css`
          width: 500px;
        `}
      >
        {chat}
      </Modal>
    </>
  );
};
