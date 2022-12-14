import { getData } from './request';

interface TaskDataRes {
  blockchain: string;
  createTime: number;
  status: string;
  taskId: number;
  taskName: string;
  taskType: string;
  blockNumber: number;
}

export interface AppsDataRes {
  appName: string;
  blockchain: string;
  handlers: string[];
}

interface EventHandlersDataRes {
  blockchain: string;
  handlerName: string;
  type: string;
  kafkaTopic: string;
  appName: string;
}

export const getTaskData = () => {
  return getData<null, { tasks: TaskDataRes[] }>(
    '/etl/api/v1/blockchain/tasks',
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface TaskLogDataRes {
  createTime: number;
  lastExecuteTime: number;
  status: string;
  taskId: number;
  taskName: string;
}

export const getTaskLogData = (taskName: string) => {
  return getData<{ taskName: string }, { tasks: TaskLogDataRes[] }>(
    '/etl/api/v1/blockchain/taskLogs',
    { taskName },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export const getAppsData = () => {
  return getData<null, { apps: AppsDataRes[] }>(
    '/etl/api/v1/blockchain/apps',
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export const getEventHandlersData = () => {
  return getData<null, { handlers: EventHandlersDataRes[] }>(
    '/etl/api/v1/blockchain/handlers',
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface BlockReq {
  chainType: string;
  blockNumber: number;
}

interface BlocksType {
  blockNumber: number;
  gasUsed: number;
  size: number;
  timestamp: string;
  transactionCount: number;
}

interface BlockDataRes {
  blocks: BlocksType[];
}

export const getBlockData = (chainType: string) => {
  return getData<{ chainType: string }, BlockDataRes>(
    '/etl/api/v1/blockchain/blocks',
    { chainType },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export const getBlockDataByBlockNumber = (params: BlockReq) => {
  return getData<{ chainType: string }, BlocksType>(
    `/etl/api/v1/blockchain/blocks/${params.blockNumber}`,
    { chainType: params.chainType },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface TransactionType {
  blockNumber: number;
  from: string;
  timestamp: string;
  to: string;
  transactionHash: string;
  value: number;
}

interface TransactionDataRes {
  transactions: TransactionType[];
}

interface TransactionReq {
  chainType: string;
  blockNumber?: number;
}

export const getTransactionData = (params: TransactionReq) => {
  return getData<TransactionReq, TransactionDataRes>(
    '/etl/api/v1/blockchain/transactions',
    params,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface TransactionDataByTxnHashType {
  chainType: string;
  transactionHash: string;
}

export const getTransactionDataByTxnHash = (
  params: TransactionDataByTxnHashType
) => {
  return getData<{ chainType: string }, TransactionType>(
    `/etl/api/v1/blockchain/transactions/${params.transactionHash}`,
    { chainType: params.chainType },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface MetadataType {
  name: string;
  image: string;
  description: string | null;
  attributes: string | null;
}

export interface ethTokenDataRes {
  address: string;
  owner: string;
  tokenId: string;
  metadata: MetadataType;
  tokenMetadataURI: string;
}

interface ethTokenDataReq {
  address?: string;
  tokenId?: string;
}

export const getEthTokenData = (params: ethTokenDataReq) => {
  return getData<ethTokenDataReq, { tokens: ethTokenDataRes[] }>(
    '/etl/api/v1/token/ethereum',
    params,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export const getEthTokenDataByOwner = (owner: string) => {
  return getData<null, { tokens: ethTokenDataRes[] }>(
    `/etl/api/v1/token/ethereum/owner/${owner}`,
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export interface flowTokenDataRes {
  address: string;
  owner: string;
  tokenId: string;
  metadata: MetadataType;
  tokenMetadataRaw: string;
  tokenMetadataURI: string;
}

interface flowTokenDataReq {
  address?: string;
  tokenId?: string;
}

export const getFlowTokenData = (params: flowTokenDataReq) => {
  return getData<flowTokenDataReq, { tokens: flowTokenDataRes[] }>(
    '/etl/api/v1/token/flow',
    params,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

export const getFlowTokenDataByOwner = (owner: string) => {
  return getData<null, { tokens: flowTokenDataRes[] }>(
    `/etl/api/v1/token/flow/owner/${owner}`,
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};

interface EventsDataRes {
  transactionHash: string;
  blockNumber: number;
  topics: string[];
  address: string;
  data: string;
}

export const getEventsData = (chainType: string) => {
  return getData<{ chainType: string }, { events: EventsDataRes[] }>(
    '/etl/api/v1/blockchain/events',
    { chainType },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
};
