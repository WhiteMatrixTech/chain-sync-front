import { Spin } from 'antd';
import Table, { ColumnsType, TableProps } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import { getTaskData } from '@/service/services';

interface adapterServicesProps {
  className?: string;
}

interface columnsType {
  blockchain: string;
  taskName: string;
  createTime: number;
  status: string;
  taskType: string;
  blockNumber: number;
}

function AdapterServices(props: adapterServicesProps) {
  const { className } = props;
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});

  const handleChange: TableProps<columnsType>['onChange'] = (
    _pagination,
    filters
  ) => {
    setFilteredInfo(filters);
  };

  const columns: ColumnsType<columnsType> = [
    {
      title: 'Blockchain',
      dataIndex: 'blockchain',
      ellipsis: true,
      filters: [
        { text: 'Flow', value: 'flow' },
        { text: 'Ethereum', value: 'ethereum' },
        { text: 'Polygon', value: 'polygon' },
        { text: 'BSC', value: 'bsc' }
      ],
      filteredValue: filteredInfo.blockchain || null,
      onFilter: (value, record) => {
        return record.blockchain === value;
      },
      sorter: {
        compare: (a, b) => a.blockchain.length - b.blockchain.length,
        multiple: 1
      },
      className: 'text-[#000000] font-[700] text-base capitalize',
      render: (_, data) => {
        if (data.blockchain === 'bsc') {
          return <div>BSC</div>;
        } else {
          return <div>{data.blockchain}</div>;
        }
      }
    },
    {
      title: 'TaskName',
      dataIndex: 'taskName',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[30%]',
      render: (_, data) => {
        return (
          <Link to={`/adapter-services/taskDetail?taskName=${data.taskName}`}>
            {data.taskName}
          </Link>
        );
      }
    },
    {
      title: 'TaskType',
      dataIndex: 'taskType',
      ellipsis: true,
      className: 'text-[#000000d9] text-base'
    },
    {
      title: 'BlockNumber',
      dataIndex: 'blockNumber',
      ellipsis: true,
      className: 'text-[#000000d9] text-base',
      render: (_, data) => {
        return <div>{data.blockNumber || 'N/A'}</div>;
      }
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      ellipsis: true,
      className: 'text-[#000000d9] text-base w-[20%]',
      render: (_, data) => {
        return (
          <div className="">{dayjs(Number(data.createTime)).toISOString()}</div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, data) => {
        return (
          <div
            className={cn(
              'text-[18px] font-[700] uppercase',
              data.status === 'paused' ? 'text-[#FF7800]' : 'text-[#499F5F]'
            )}
          >
            {data.status}
          </div>
        );
      }
    }
  ];

  const [
    { loading: getAdaptServicesLoading, value: adaptServicesData },
    getAdaptServices
  ] = useAsyncFn(async () => {
    const response = await getTaskData();

    return response.tasks.sort(
      (a, b) => b.blockchain.length - a.blockchain.length
    );
  });

  useEffect(() => {
    void getAdaptServices();
  }, [getAdaptServices]);

  return (
    <div className={cn(className)}>
      <div className="text-[24px] font-[600] capitalize text-[#2483FF] ">
        Data Adapter Jobs
      </div>

      <Spin spinning={status === 'loading'} tip="downloading">
        <div className={cn(className, 'pt-10 font-Roboto')}>
          <Table
            rowKey={(record) => `${record.blockNumber} - ${uuidv4()}`}
            columns={columns}
            dataSource={adaptServicesData}
            loading={getAdaptServicesLoading}
            // pagination={false}
            onChange={handleChange}
          />
        </div>
      </Spin>
    </div>
  );
}

export default AdapterServices;
