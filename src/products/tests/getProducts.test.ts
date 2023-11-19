import { PRODUCTS_MOCK } from "../products.constants";
import { buildResponse } from "../../utils";
import { getProducts } from "../handlers/getProducts";

describe("GetProductById", () => {
  it("should return all products", async () => {
    const handlerResp = await getProducts();
    expect(handlerResp).toEqual(buildResponse(200, PRODUCTS_MOCK));
  });
});
