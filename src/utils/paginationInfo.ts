import { logger, query } from './'

/**
 * @description Gets total pages and total items
 * Takes an obj made up of:
 * @param {string} select the query we will run
 * @param {Array<string | number>} params passed to query, note: only send where condition!
 * @param {number} limit the limit of
 * @returns {{totalPages: number, total: number}} object containing totalPages and total number of items.
 */
export async function getPaginationInfo({
  select,
  limit = 20,
  params
}: {
  select: string
  limit?: number
  params: Array<string | number>
}): Promise<{
  totalPages: number
  total: number
}> {
  logger.debug(`Getting amount for ${select} `)
  const result = await query(select.replace('*', 'COUNT(*)'), params)
  const total = parseInt(result.rows[0].count)
  const totalPages = Math.ceil(total / limit)

  return {
    totalPages,
    total
  }
}
