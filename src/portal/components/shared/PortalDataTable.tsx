import React, { useState } from 'react';
import { Table, Button, Input, Card } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

interface PortalDataTableProps<T> {
  title: string;
  columns: TableColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  total?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (keyword: string) => void;
  onAddNew?: () => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  extraActions?: React.ReactNode;
}

export function PortalDataTable<T extends { id: any }>({
  title,
  columns,
  dataSource,
  loading,
  total = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  onAddNew,
  onRefresh,
  searchPlaceholder = 'Search…',
  extraActions,
}: PortalDataTableProps<T>) {
  const [keyword, setKeyword] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <Card className="rounded-3xl border border-neutral-200 shadow-sm p-2 sm:p-4">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 m-0">{title}</h2>
          <p className="text-xs text-neutral-400 mt-1 m-0">Total records: {total}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined className="text-neutral-400" />}
            value={keyword}
            onChange={handleSearchChange}
            allowClear
            className="w-full sm:w-64 rounded-xl"
          />

          {onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              className="rounded-xl"
              title="Reload data"
            />
          )}

          {extraActions}

          {onAddNew && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddNew}
              className="rounded-xl !bg-[#005D9A] shadow-sm font-semibold"
            >
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: onPageChange,
          showSizeChanger: true,
          showTotal: (totalCount) => `Total ${totalCount} items`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}