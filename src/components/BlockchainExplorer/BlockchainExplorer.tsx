import { ArrowDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Select, Spin, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import {
  getBlockData,
  getBlockDataByBlockNumber,
  getEventsData,
  getTransactionData
} from '@/service/services';

import styles from './BlockchainExplorer.module.less';

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
        if (data.size) {
          return <div>{data.size}</div>;
        }

        return <div>N/A</div>;
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
        if (data.gasUsed) {
          return <div>{data.gasUsed}</div>;
        }

        return <div>N/A</div>;
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

  const transactionColumns: ColumnsType<TransactionColumnsType> = [
    {
      title: 'TxnHash',
      dataIndex: 'transactionHash',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[20%]'
    },
    {
      title: 'BlockNumber',
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
          <div className="">{dayjs(Number(data.timestamp)).toISOString()}</div>
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

        return <div>N/A</div>;
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

        return <div>N/A</div>;
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
          return <div>{data.value || 'N/A'}</div>;
        }
        return <div>{data.value / 1e18}</div>;
      }
    }
  ];

  const eventsColumns: ColumnsType<EventsColumnsType> = [
    {
      title: 'TxnHash',
      dataIndex: 'transactionHash',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    },
    {
      title: 'Contract',
      dataIndex: 'address',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    },
    {
      title: 'BlockNumber',
      dataIndex: 'blockNumber',
      ellipsis: true,
      className: 'text-[#000000] font-[700] text-base w-[15%]'
    },
    {
      title: 'Data',
      dataIndex: 'data',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        if (!data.data) {
          return <div>N/A</div>;
        }
        return (
          <Tooltip
            overlayStyle={{
              maxWidth: '50%'
            }}
            overlayInnerStyle={{
              padding: '16px',
              background: '#313857',
              borderRadius: '8px'
            }}
            placement="top"
            arrowPointAtCenter={true}
            title={data.data}
          >
            <div className={cn(styles.description)}>{data.data}</div>
          </Tooltip>
        );
      }
    },
    {
      title: 'Topics',
      dataIndex: 'topics',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[25%]',
      render: (_, data) => {
        if (!data.topics) {
          return <div>N/A</div>;
        }
        return (
          <div>
            {data.topics.map((item, index) => (
              <div key={index} className="m-[5px] text-[#ffffff]">
                {`${item}`}
                {index >= data.topics.length - 1 ? '' : ','}
              </div>
            ))}
          </div>
        );
      }
    }
  ];

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
    <div className={cn(className, 'py-4')}>
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
          onChange={(value: string) => setSelectedChain(value)}
        />
      </div>

      <div className="mt-10">
        <div className="text-[20px] text-[#ffffff]">Latest Blocks</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-4')}>
            <Table
              rowKey={(record) => `${record.blockNumber} - ${uuidv4()}`}
              columns={blockColumns}
              dataSource={blocksData}
              loading={getBlockDataLoading}
              pagination={false}
            />
            <div className="flex cursor-pointer justify-center  border-t-[1px] border-[#474E6C] bg-[#262D4E] text-[16px] font-[400]">
              <Link
                className="my-4 flex items-center rounded-[8px] bg-[#303961] py-4 px-8 text-[#ffffff]"
                to="/data-store/blocks"
              >
                <ArrowDownOutlined />
                <span className="ml-2">View More</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>

      <div className="mt-10">
        <div className="text-[20px] text-[#ffffff]">Latest Transactions</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-4')}>
            <Table
              rowKey={(record) => `${record.blockNumber} - ${uuidv4()}`}
              columns={transactionColumns}
              dataSource={transactionsData}
              loading={getTransactionsLoading}
              pagination={false}
            />
            <div className="flex cursor-pointer justify-center  border-t-[1px] border-[#474E6C] bg-[#262D4E] text-[16px] font-[400]">
              <Link
                className="my-4 flex items-center rounded-[8px] bg-[#303961] py-4 px-8 text-[#ffffff]"
                to="/data-store/transactions"
              >
                <ArrowDownOutlined />
                <span className="ml-2">View More</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>

      <div className="mt-10">
        <div className="text-[20px] text-[#ffffff]">Latest Events</div>

        <Spin spinning={status === 'loading'} tip="downloading">
          <div className={cn(className, 'pt-4')}>
            <Table
              rowKey={(record) => `${record.address} - ${uuidv4()}`}
              columns={eventsColumns}
              dataSource={eventsData}
              loading={getEventsLoading}
              pagination={false}
            />
            <div className="flex cursor-pointer justify-center  border-t-[1px] border-[#474E6C] bg-[#262D4E] text-[16px] font-[400]">
              <Link
                className="my-4 flex items-center rounded-[8px] bg-[#303961] py-4 px-8 text-[#ffffff]"
                to="/data-store/events"
              >
                <ArrowDownOutlined />
                <span className="ml-2">View More</span>
              </Link>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}
