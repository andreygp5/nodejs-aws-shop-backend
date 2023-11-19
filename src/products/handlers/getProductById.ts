import { APIGatewayEvent } from "aws-lambda";
import { buildResponse } from "../../utils";
import { PRODUCTS_MOCK } from "../products.constants";

export const getProductById = async (event: APIGatewayEvent) => {
  const productId = event.pathParameters?.["productId"];

  const product = PRODUCTS_MOCK.find((product) => product.id === productId);
  if (product) {
    return buildResponse(200, product);
  } else {
    return buildResponse(404, { message: "Product not found" });
  }
};
