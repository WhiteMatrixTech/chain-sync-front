import { SearchOutlined } from '@ant-design/icons';
import { Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';

import {
  getBlockData,
  getEventsData,
  getTransactionData
} from '@/service/services';

interface BlockchainExplorerProps {
  className?: string;
}

interface BlockColumnsType {
  blockNumber: number;
  gasUsed: number;
  size: number;
  timestamp: string;
  transactionCount: number;
}

interface TransactionColumnsType {
  blockNumber: number;
  from: string;
  timestamp: string;
  to: string;
  transactionHash: string;
  value: number;
}

interface EventsColumnsType {
  transactionHash: string;
  blockNumber: number;
  topics: string[];
  address: string;
  data: string;
}

export function BlockchainExplorer(props: BlockchainExplorerProps) {
  const { className } = props;

  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [searchValue, setSearchValue] = useState<string>('');

  const blockColumns: ColumnsType<BlockColumnsType> = [
    {
      title: 'Block Number',
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
        if (data.size) {
          return <div>{data.size}</div>;
        }

        return <div>null</div>;
      }
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return (
          <div className="">
            {dayjs(Number(data.timestamp)).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        );
      }
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        if (data.gasUsed) {
          return <div>{data.gasUsed}</div>;
        }

        return <div>null</div>;
      }
    },
    {
      title: 'Transaction Count',
      dataIndex: 'transactionCount',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return (
          <div className="text-[#2483FF] underline underline-offset-2">
            {data.transactionCount}
          </div>
        );
      }
    }
  ];

  const transactionColumns: ColumnsType<TransactionColumnsType> = [
    {
      title: 'Txn Hash',
      dataIndex: 'transactionHash',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[20%]'
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      ellipsis: true,
      className: 'text-[#000000] font-[700] text-base capitalize'
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return (
          <div className="">
            {dayjs(Number(data.timestamp)).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        );
      }
    },
    {
      title: 'From',
      dataIndex: 'from',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[20%]',
      render: (_, data) => {
        if (data.from) {
          return <div>{data.from}</div>;
        }

        return <div>null</div>;
      }
    },

    {
      title: 'To',
      dataIndex: 'to',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[20%]',
      render: (_, data) => {
        if (data.to) {
          return <div>{data.to}</div>;
        }

        return <div>null</div>;
      }
    },
    {
      title: `Value (${
        selectedChain === 'bsc'
          ? 'BNB'
          : selectedChain === 'flow'
          ? 'Flow'
          : 'ETH'
      })`,
      dataIndex: 'value',
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        if (selectedChain === 'flow') {
          return <div>{data.value || 'null'}</div>;
        }
        return <div>{data.value / 1e18}</div>;
      }
    }
  ];

  const eventsColumns: ColumnsType<EventsColumnsType> = [
    {
      title: 'Topics',
      dataIndex: 'topics',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[25%]',
      render: (_, data) => {
        return (
          <div>
            {data.topics.map((item, index) => (
              <div key={index} className="m-[5px] text-[#000000d9]">
                {`"${item}"`}
                {index >= data.topics.length - 1 ? '' : '、'}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Txn Hash',
      dataIndex: 'transactionHash',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      ellipsis: true,
      className: 'text-[#000000] font-[700] text-base w-[15%]'
    },
    {
      title: 'Data',
      dataIndex: 'data',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    }
  ];

  const [
    { loading: getBlockDataLoading, value: blocksData },
    getBlocksServices
  ] = useAsyncFn(async (chainType: string, blockNumber?: number) => {
    if (blockNumber) {
      const response = await getBlockData({ chainType, blockNumber });
      return response.blocks.length > 3
        ? response.blocks.slice(0, 3)
        : response.blocks;
    }
    const response = await getBlockData({ chainType });

    return response.blocks.length > 3
      ? response.blocks.slice(0, 3)
      : response.blocks;
  });

  const [
    { loading: getTransactionsLoading, value: transactionsData },
    getTransactionsServices
  ] = useAsyncFn(async (chainType: string, blockNumber?: number) => {
    if (blockNumber) {
      const response = await getTransactionData({ chainType, blockNumber });
      return response.transactions.length > 3
        ? response.transactions.slice(0, 3)
        : response.transactions;
    }
    const response = await getTransactionData({ chainType });

    return response.transactions.length > 3
      ? response.transactions.slice(0, 3)
      : response.transactions;
  });

  const [{ loading: getEventsLoading, value: eventsData }, getEventsServices] =
    useAsyncFn(async (chainType: string) => {
      const response = await getEventsData(chainType);

      return response.events.length > 3
        ? response.events.slice(0, 3)
        : response.events;
    });

  useEffect(() => {
    void getEventsServices(selectedChain);
    if (searchValue) {
      void getBlocksServices(selectedChain, Number(searchValue));
      void getTransactionsServices(selectedChain, Number(searchValue));
      return;
    }
    void getBlocksServices(selectedChain);
    void getTransactionsServices(selectedChain);
  }, [
    getBlocksServices,
    getEventsServices,
    getTransactionsServices,
    searchValue,
    selectedChain
  ]);

  return (
    <div className={cn(className, 'py-20')}>
      <div className="flex">
        <input
          value={searchValue}
          placeholder="Search by block number"
          className="h-10 w-[500px] border-[1px] border-[#D9D9D9] p-2 outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div
          className="flex h-10 w-11 items-center justify-center bg-[#1890FF] text-[#FFFFFF]"
          style={{ boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)' }}
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
              value: 'flow',
              label: 'Flow'
            },
            {
              value: 'bsc',
              label: 'BSC'
            }
          ]}
          onChange={(value: string) => setSelectedChain(value)}
        />
      </div>

      <div className="mt-14">
        <div className="text-[20px] text-[#2483FF]">Latest Blocks</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-10 font-Roboto')}>
            <Table
              rowKey="userId"
              columns={blockColumns}
              dataSource={blocksData}
              loading={getBlockDataLoading}
              pagination={false}
            />
            <div className="mt-[2px] cursor-pointer text-right text-[16px] font-[600] text-[#1890FF]">
              <Link to="/data-store/blocks">
                View More <span className="mx-2">{'>'}</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>

      <div className="mt-14">
        <div className="text-[20px] text-[#2483FF]">Latest Transactions</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-10 font-Roboto')}>
            <Table
              rowKey="userId"
              columns={transactionColumns}
              dataSource={transactionsData}
              loading={getTransactionsLoading}
              pagination={false}
            />
            <div className="mt-[2px] cursor-pointer text-right text-[16px] font-[600] text-[#1890FF]">
              <Link to="/data-store/transactions">
                View More <span className="mx-2">{'>'}</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>

      <div className="mt-14">
        <div className="text-[20px] text-[#2483FF]">Latest Events</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-10 font-Roboto')}>
            <Table
              rowKey="userId"
              columns={eventsColumns}
              dataSource={eventsData}
              loading={getEventsLoading}
              pagination={false}
            />
            <div className="mt-[2px] cursor-pointer text-right text-[16px] font-[600] text-[#1890FF]">
              <Link to="/data-store/events">
                View More <span className="mx-2">{'>'}</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}