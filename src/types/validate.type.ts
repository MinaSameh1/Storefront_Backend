type options = {
  type: string
  optional?: boolean
  max?: number
  min?: number
  default?: unknown
}

export interface validateType {
  [name: string]: options
}
