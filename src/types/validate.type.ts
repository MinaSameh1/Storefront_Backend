type options = {
  type: string
  optional?: boolean
}

export interface validateType {
  [name: string]: options
}
