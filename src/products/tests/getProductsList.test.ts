import { PRODUCTS_MOCK } from "../products.constants";
import { buildResponse } from "../../utils";
import { getProductsList } from "../handlers/getProductsList";

describe("GetProductsList", () => {
  it("should return all products", async () => {
    const handlerResp = await getProductsList();
    expect(handlerResp).toEqual(buildResponse(200, PRODUCTS_MOCK));
  });
});
