import "jasmine";
import * as UserInfoData from "./mocks/data/userinfo.json";
import {
  IContext,
  IExplorerContext,
  ISearchResults,
  RESOURCE,
} from "../ts/index";
import { Subscription } from "rxjs";

/** Test the fundations of the framework. */
describe("Foundation", function () {
  const context: IExplorerContext | null = null;
  const userinfo = UserInfoData;
  let subscription: Subscription | undefined;
  let latestResult: ISearchResults | null = null;

  /** Utility function */
  const getModel = (): IContext => {
    const model = context?.getContext();
    if (typeof model === "undefined")
      throw new Error("Context seems undefined.");
    return model;
  };

  /** @test Mocked data */
  //FIXME validate against jsonschema ?
  it("should have mocked data", () => {
    expect(userinfo.apps).toBeDefined();
  });

  /** @test Subscribe to search results flow. */
  it("has a result flow to subscribe to", () => {
    subscription = context?.latestResources().subscribe({
      next: (result) => {
        latestResult = result.output;
        return "NEXT";
      },
      error: (err) => {
        throw new Error(`ERROR: ${err}`);
      },
      complete: () => "UNSUBSCRIBED",
    });
  });

  /** @test Accessing the context, before initializing it, has an undefined result. */
  it("is using the context before initializing it, thus throwing an error.", () => {
    expect(context?.getContext()).not.toBeDefined;
  });

  /**
   * @test Mocking the agents.
   * Créer des dossiers, sous-dossiers, lister les dossiers et comparer le résultat.
   * Cela nécessite de mocker le serveur.
   **/

  it("should initialize a context", async () => {
    const ctx = await context?.initialize();
    expect(ctx).toBeDefined();
  });

  it("should have received a resultset", () => {
    expect(latestResult).toEqual(getModel());
  });

  it("can unsubscribe to the result flow", () => {
    latestResult = null;
    expect(() => subscription?.unsubscribe()).not.toThrowError();
  });

  it("should have access to folders of first level", () => {
    expect(getModel().folders).toBeInstanceOf(Array);
    expect(getModel().folders.length).toBe(0);
  });

  it("can create a top level folder.", async () => {
    const result = await context?.createFolder(
      RESOURCE.FOLDER,
      "default",
      "Root folder 1",
    );
    expect(result).toBeDefined();
    expect(result?.name).toBe("Root folder 1");
    if (result) getModel().folders.push(result);
  });

  it("should have access to folders of first level", () => {
    expect(getModel().folders.length).toBe(1);
  });

  //    it("", ()=>{});

  //    it("", ()=>{});
});
