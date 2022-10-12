type options = {
  type: string
  optional?: boolean
  max?: number
  min?: number
}

export interface validateType {
  [name: string]: options
}
