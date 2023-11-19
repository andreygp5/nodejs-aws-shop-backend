import { PRODUCTS_MOCK } from "../products.constants";
import { APIGatewayEvent } from "aws-lambda";
import { buildResponse } from "../../utils";
import { getProductById } from "../handlers/getProductById";

describe("GetProductById", () => {
  it("should return product by id", async () => {
    const productId = "1";
    const product = PRODUCTS_MOCK.find((product) => product.id === productId);

    const handlerResp = await getProductById({
      pathParameters: { productId },
    } as unknown as APIGatewayEvent);
    expect(handlerResp).toEqual(buildResponse(200, product));
  });

  it("should return 404 if product can not be found", async () => {
    const handlerResp = await getProductById({
      pathParameters: { productId: "100" },
    } as unknown as APIGatewayEvent);
    expect(handlerResp.statusCode).toBe(404);
  });
});
