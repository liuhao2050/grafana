import React, { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { dump, load } from 'js-yaml';
import { css } from '@emotion/css';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GrafanaTheme2 } from '@grafana/data';
import { Button, CodeEditor, Drawer, Tab, TabsBar, useStyles2 } from '@grafana/ui';
import { RuleFormValues } from '../../types/rule-form';

interface Props {
  onClose: () => void;
}

const tabs = [{ label: 'Yaml', value: 'yaml' }];

export const RuleInspector: FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('yaml');
  const { setValue } = useFormContext();
  const onApply = (formValues: RuleFormValues) => {
    // Need to loop through all values and set them individually
    Object.entries(formValues).map(([key, value]) => {
      setValue(key, value);
    });
    onClose();
  };

  return (
    <Drawer
      title="Inspect Alert rule"
      subtitle={<RuleInspectorSubtitle setActiveTab={setActiveTab} activeTab={activeTab} />}
      onClose={onClose}
    >
      {activeTab === 'yaml' && <InspectorYamlTab onSubmit={onApply} />}
    </Drawer>
  );
};

interface SubtitleProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RuleInspectorSubtitle: FC<SubtitleProps> = ({ activeTab, setActiveTab }) => {
  return (
    <TabsBar>
      {tabs.map((tab, index) => {
        return (
          <Tab
            key={`${tab.value}-${index}`}
            label={tab.label}
            value={tab.value}
            onChangeTab={() => setActiveTab(tab.value)}
            active={activeTab === tab.value}
          />
        );
      })}
    </TabsBar>
  );
};

interface YamlTabProps {
  onSubmit: (newModel: RuleFormValues) => void;
}

const InspectorYamlTab: FC<YamlTabProps> = ({ onSubmit }) => {
  const styles = useStyles2(yamlTabStyle);
  const { getValues } = useFormContext<RuleFormValues>();
  const [alertRuleAsYaml, setAlertRuleAsYaml] = useState(dump(getValues()));

  const onApply = () => {
    onSubmit(load(alertRuleAsYaml) as RuleFormValues);
  };

  return (
    <>
      <div className={styles.applyButton}>
        <Button type="button" onClick={onApply}>
          Apply
        </Button>
      </div>
      <div className={styles.content}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CodeEditor
              width="100%"
              height={height}
              language="yaml"
              value={alertRuleAsYaml}
              onBlur={setAlertRuleAsYaml}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
};

const yamlTabStyle = (theme: GrafanaTheme2) => ({
  content: css`
    flex-grow: 1;
    height: 100%;
    padding-bottom: 16px;
    margin-bottom: ${theme.spacing(2)};
  `,
  applyButton: css`
    display: flex;
    flex-grow: 0;
  `,
});