import { SearchOutlined } from '@ant-design/icons';
import { Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';

import { getBlockData, getBlockDataByBlockNumber } from '@/service/services';

interface blockProps {
  className?: string;
}

interface BlockColumnsType {
  blockNumber: number;
  gasUsed: number;
  size: number;
  timestamp: string;
  transactionCount: number;
}

function Blocks(props: blockProps) {
  const { className } = props;
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [searchValue, setSearchValue] = useState<string>('');

  const Columns: ColumnsType<BlockColumnsType> = [
    {
      title: 'BlockNumber',
      dataIndex: 'blockNumber',
      ellipsis: true,
      className: 'text-[#000000] font-[700] text-base capitalize'
    },
    {
      title: 'Size',
      dataIndex: 'size',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return <div>{data.size || 'N/A'}</div>;
      }
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return (
          <div className="">{dayjs(Number(data.timestamp)).toISOString()}</div>
        );
      }
    },
    {
      title: 'GasUsed',
      dataIndex: 'gasUsed',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return <div>{data.gasUsed || 'N/A'}</div>;
      }
    },
    {
      title: 'TransactionCount',
      dataIndex: 'transactionCount',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return (
          <Link
            to={`/data-store/transactions?blockchain=${selectedChain}?blockNumber=${data.blockNumber}`}
          >
            {data.transactionCount}
          </Link>
        );
      }
    }
  ];

  const handleChangeSelect = (value: string) => {
    setSelectedChain(value);
  };

  const [
    { loading: getBlockDataLoading, value: blocksData },
    getBlocksServices
  ] = useAsyncFn(async (chainType: string, blockNumber?: number) => {
    if (blockNumber) {
      const response = await getBlockDataByBlockNumber({
        chainType,
        blockNumber
      });
      return [response];
    }
    const response = await getBlockData(chainType);

    return response.blocks;
  });

  useEffect(() => {
    if (searchValue) {
      return void getBlocksServices(selectedChain, Number(searchValue));
    }
    void getBlocksServices(selectedChain);
  }, [getBlocksServices, searchValue, selectedChain]);

  return (
    <div className={cn(className)}>
      <div className="pb-4 text-[24px] font-[600] capitalize text-[#2483FF]">
        <Link to="/data-store?params=blockchain">Blockchain Explorer</Link>
        <span className="mx-4">{'>'}</span>
        <span className="text-[#ffffff]">blocks</span>
      </div>

      <div className="flex">
        <input
          value={searchValue}
          placeholder="Search by block number"
          className="h-10 w-[400px] rounded-l-[8px] border-[1px] border-[#ffffff66] bg-transparent p-2 text-[#ffffff] outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div
          className="flex h-10 w-11 items-center justify-center rounded-r-[8px] bg-[#1890FF] text-[#FFFFFF]"
          style={{ boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)' }}
          onClick={() =>
            void getBlocksServices(selectedChain, Number(searchValue))
          }
        >
          <SearchOutlined />
        </div>

        <Select
          defaultValue="ethereum"
          style={{ width: '210px', marginLeft: '30px' }}
          options={[
            {
              value: 'ethereum',
              label: 'Ethereum'
            },
            {
              value: 'polygon',
              label: 'Polygon'
            },
            {
              value: 'bsc',
              label: 'BNB Chain'
            },
            {
              value: 'flow',
              label: 'Flow'
            }
          ]}
          onChange={handleChangeSelect}
        />
      </div>

      <Spin spinning={status === 'loading'} tip="downloading">
        <div className={cn(className, 'pt-10')}>
          <Table
            rowKey={(record) => `${record.blockNumber}-${record.timestamp}`}
            columns={Columns}
            dataSource={blocksData}
            loading={getBlockDataLoading}
          />
        </div>
      </Spin>
    </div>
  );
}

export default Blocks;
