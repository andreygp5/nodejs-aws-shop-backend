import { buildResponse } from "../../utils";
import { PRODUCTS_MOCK } from "../products.constants";

export const getProducts = async () => {
  return buildResponse(200, PRODUCTS_MOCK);
};
