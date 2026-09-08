import { useEffect, useState, useCallback } from 'react';
import { Tag, Button, Drawer, Card, Statistic, Row, Col, message } from 'antd';
import { DownloadOutlined, HeartOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { fetchCollection } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { exportToCsv } from '../../utils/csv';

export function SupportLedgerPage() {
  const { token } = usePortalAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection('support-submissions', { pageSize: 100, sort: 'createdAt:desc' }, token);
      setData(res.data);
    } catch (err: any) {
      message.error('Failed to load support ledger');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = () => {
    if (!data.length) {
      message.warning('No records to export');
      return;
    }
    const rows = data.map((item) => ({
      FullName: item.fullName,
      Email: item.email,
      Projects: Array.isArray(item.projects) ? item.projects.join('; ') : item.projects,
      FinancialGiftDetails: item.financialGiftDetails || 'N/A',
      DonationFrequency: item.donationFrequency,
      LetterMessage: item.letter,
      DateSubmitted: item.createdAt,
    }));
    exportToCsv(`YOU_Donations_Ledger_${new Date().toISOString().split('T')[0]}`, rows);
    message.success('Ledger exported to CSV');
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Supporter Name',
      dataIndex: 'fullName',
      key: 'name',
      render: (name: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => { setSelectedLetter(record); setDrawerOpen(true); }}>
          {name}
        </span>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Frequency',
      dataIndex: 'donationFrequency',
      key: 'freq',
      render: (freq: string) => <Tag color={freq === 'monthly' ? 'blue' : 'default'}>{freq?.toUpperCase()}</Tag>,
    },
    {
      title: 'Financial Gift',
      dataIndex: 'financialGiftDetails',
      key: 'gift',
      render: (gift: string) => (gift ? <span className="font-semibold text-emerald-600">{gift}</span> : <span className="text-neutral-400">Pure Letter</span>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => { setSelectedLetter(record); setDrawerOpen(true); }}>
          Read Letter
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-neutral-100 shadow-sm">
            <Statistic title="Total Supporters" value={data.length} prefix={<HeartOutlined className="text-rose-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-neutral-100 shadow-sm">
            <Statistic
              title="Financial Pledges"
              value={data.filter((d) => d.financialGiftDetails).length}
              prefix={<DollarOutlined className="text-emerald-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-neutral-100 shadow-sm">
            <Statistic
              title="Recurring Monthly Donors"
              value={data.filter((d) => d.donationFrequency === 'monthly').length}
              prefix={<HeartOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
      </Row>

      <PortalDataTable
        title="Supporter Postbox & Ledger"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={data.length}
        onRefresh={loadData}
        extraActions={
          <Button icon={<DownloadOutlined />} onClick={handleExport} className="rounded-xl font-semibold">
            Export CSV
          </Button>
        }
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={540}
        title="Supporter Letter & Pledge"
      >
        {selectedLetter && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-neutral-400 m-0">From Supporter:</p>
              <h3 className="text-lg font-bold text-neutral-900 m-0">{selectedLetter.fullName}</h3>
              <a href={`mailto:${selectedLetter.email}`} className="text-blue-600">{selectedLetter.email}</a>
            </div>

            {selectedLetter.financialGiftDetails && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs text-emerald-800 font-semibold block">Financial Pledge:</span>
                <span className="text-base font-bold text-emerald-900">{selectedLetter.financialGiftDetails}</span>
                <span className="text-xs text-emerald-700 block mt-1">Frequency: {selectedLetter.donationFrequency}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-neutral-400 block mb-1">Letter of Encouragement:</span>
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl leading-relaxed whitespace-pre-line italic">
                "{selectedLetter.letter}"
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}