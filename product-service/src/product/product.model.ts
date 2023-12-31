import { number, object, ObjectSchema, string } from 'yup'

export interface Product {
  id: string
  title: string
  description?: string
  price: number
  count: number
}

export interface ProductDto extends Omit<Product, 'id'> {}

export interface ProductTable extends Omit<Product, 'count'> {}

export const productDtoSchema: ObjectSchema<ProductDto> = object({
  title: string().required().defined(),
  description: string(),
  price: number().required().integer().min(0).defined(),
  count: number().required().integer().min(0).defined(),
}).noUnknown(true)
