import { QueryResult } from 'pg'

export type DatabaseQuery = (
  text: string,
  values?: unknown[],
) => Promise<Pick<QueryResult, 'rows' | 'rowCount'>>
